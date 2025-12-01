import $ from "jquery";
import { auth, db } from "./firebase.js";
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function waitForUser() {
    return new Promise(resolve => {
        if (auth.currentUser) return resolve(auth.currentUser);
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                unsubscribe();
                resolve(user);
            }
        });
    });
}

export async function initYourRecipesPage() {
    const user = await waitForUser();

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        const data = snap.data();
        $("#creatorName").text(data.firstName);
    }

    const recipesContainer = $(".food-flex");
    recipesContainer.empty();

    const recipesCol = collection(db, "recipes");
    const q = query(recipesCol, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        recipesContainer.append("<p>No recipes found.</p>");
        return;
    }

    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    recipes.sort((a, b) => {
        const timeA = a.editTime ? a.editTime.toMillis() : 0;
        const timeB = b.editTime ? b.editTime.toMillis() : 0;

        if (timeA !== timeB) return timeB - timeA;

        const titleA = a.title ? a.title.toLowerCase() : "";
        const titleB = b.title ? b.title.toLowerCase() : "";
        if (titleA < titleB) return 1;
        if (titleA > titleB) return -1;
        return 0;
    });

    recipes.forEach(recipe => {
        const src = recipe.imageBase64 || `./img/recipes/${recipe.imageUrl}`;
        const recipeHtml = `
            <div class="food-card" data-id="${recipe.id}">
                <div class="card-flex">
                    <div class="image-wrap">
                        <img class="card-image" src="${src}" alt="">
                        <a href="#page-view-recipe?id=${recipe.id}" class="fancy-button view-btn">View</a>
                    </div>
                    <div class="card-text">
                        <div>
                            <h3 class="card-title">${recipe.title}</h3>
                            <p class="card-description">${recipe.description}</p>
                        </div>
                        <div class="card-info-row">
                            <img class="info-icon" src="./img/clock-icon.png" alt="">
                            <span class="info-text">${recipe.time}</span>
                        </div>
                        <div class="card-info-row">
                            <img class="info-icon" src="./img/servings-icon.png" alt="">
                            <span class="info-text">${recipe.servings}</span>
                        </div>
                    </div>
                </div>
                <div class="card-buttons">
                    <a class="fancy-button" href="#page-edit-recipe?id=${recipe.id}">Edit Recipe</a>
                    <button class="fancy-button delete-btn">Delete</button>
                </div>
            </div>
        `;
        recipesContainer.append(recipeHtml);
    });

    $(".delete-btn").on("click", async function () {
        const card = $(this).closest(".food-card");
        const id = card.data("id");
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;
        await deleteDoc(doc(db, "recipes", id));
        card.remove();
        if ($(".food-flex").children(".food-card").length === 0) {
            $(".food-flex").append("<p>No recipes found.</p>");
        }
    });
}
