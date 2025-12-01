import $ from "jquery";
import { auth, db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function waitForUser() {
    return new Promise(resolve => {
        if (auth.currentUser) return resolve(auth.currentUser);
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        });
    });
}

export async function initBrowsePage() {
    await waitForUser();

    const recipesContainer = $(".food-flex");
    recipesContainer.empty();

    const recipesCol = collection(db, "recipes");
    const snapshot = await getDocs(recipesCol);

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
        const src = recipe.imageBase64 || `/img/recipes/${recipe.imageUrl}`;
        const recipeHtml = `
            <div class="food-card">
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
                            <img class="info-icon" src="/img/clock-icon.png" alt="">
                            <span class="info-text">${recipe.time}</span>
                        </div>
                        <div class="card-info-row">
                            <img class="info-icon" src="/img/servings-icon.png" alt="">
                            <span class="info-text">${recipe.servings}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        recipesContainer.append(recipeHtml);
    });
}
