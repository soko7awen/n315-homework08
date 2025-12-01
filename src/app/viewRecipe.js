import $ from "jquery";
import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

export async function initViewRecipePage(params) {
    const recipeId = params.id;
    if (!recipeId) return;

    const recipeRef = doc(db, "recipes", recipeId);
    const snap = await getDoc(recipeRef);
    if (!snap.exists()) return;

    const data = snap.data();
    $("#recipeTitle").text(data.title);
    $("#recipeDescription").text(data.description);
    $("#recipeTime").text(data.time);
    $("#recipeServings").text(data.servings);

    const src = data.imageBase64 || `../img/recipes/${data.imageUrl}`;
    $("#recipeImage").attr("src", src);

    const ingredientsList = $("#ingredientsList");
    ingredientsList.empty();
    data.ingredients.forEach(ing => {
        $("<li>").text(ing).appendTo(ingredientsList);
    });

    const instructionsList = $("#instructionsList");
    instructionsList.empty();
    data.instructions.forEach(instr => {
        $("<li>").text(instr).appendTo(instructionsList);
    });
}
