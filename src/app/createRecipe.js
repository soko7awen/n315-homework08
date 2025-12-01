import $ from "jquery";
import { auth, db } from "./firebase.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function initCreateRecipePage() {
    const user = await new Promise(resolve => {
        if (auth.currentUser) return resolve(auth.currentUser);
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        });
    });

    if (!user) {
        alert("You must be logged in to create a recipe.");
        window.location.hash = "#page-login";
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        const data = snap.data();
        $("#creatorName").text(data.firstName);
    }

    let recipeImageBase64 = "";

    $("#attachImageBtn").on("click", () => {
        $("#recipeFileInput").click();
    });

    $("#recipeFileInput").on("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        $("#recipeImageInput").val(file.name);

        const reader = new FileReader();
        reader.onload = function(evt) {
            recipeImageBase64 = evt.target.result;
        };
        reader.readAsDataURL(file);
    });

    $("#addIngredientBtn").on("click", () => {
        const count = $(".ingredient-input").length + 1;
        const row = $("<div>").addClass("form-row");
        const input = $("<input>").attr("type", "text").addClass("ingredient-input").attr("placeholder", "Ingredient #" + count);
        const btn = $("#addIngredientBtn");
        btn.detach();
        row.append(input).append(btn);
        $(".ingredients-section").append(row);
    });

    $("#addInstructionBtn").on("click", () => {
        const count = $(".instruction-input").length + 1;
        const row = $("<div>").addClass("form-row");
        const input = $("<input>").attr("type", "text").addClass("instruction-input").attr("placeholder", "Instruction #" + count);
        const btn = $("#addInstructionBtn");
        btn.detach();
        row.append(input).append(btn);
        $(".instructions-section").append(row);
    });

    $("#createRecipeForm").on("submit", async (e) => {
        e.preventDefault();

        const title = $("#recipeName").val();
        const description = $("#recipeDescription").val();
        const time = $("#recipeTime").val();
        const servings = $("#recipeServings").val();

        const ingredients = $(".ingredient-input").map(function () { return $(this).val(); }).get();
        const instructions = $(".instruction-input").map(function () { return $(this).val(); }).get();

        await addDoc(collection(db, "recipes"), {
            title,
            description,
            imageBase64: recipeImageBase64,
            time,
            servings,
            ingredients,
            instructions,
            userId: user.uid,
            editTime: serverTimestamp()
        });

        window.location.hash = "#page-browse";
    });
}
