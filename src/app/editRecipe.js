import $ from "jquery";
import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export async function initEditRecipePage(params) {
    const recipeId = params.id;

    const user = await new Promise(resolve => {
        if (auth.currentUser) return resolve(auth.currentUser);
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        });
    });

    if (!user) {
        alert("You must be logged in to edit a recipe.");
        window.location.hash = "#page-login";
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) $("#creatorName").text(snap.data().firstName);

    const recipeRef = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeRef);
    if (!recipeSnap.exists()) return;
    const recipe = recipeSnap.data();

    let recipeImageBase64 = recipe.imageBase64 || "";

    $("#recipeImageInput").val(recipe.imageUrl || "");
    $("#recipeName").val(recipe.title || "");
    $("#recipeDescription").val(recipe.description || "");
    $("#recipeTime").val(recipe.time || "");
    $("#recipeServings").val(recipe.servings || "");

    const rawIngredientBtn = $("#addIngredientBtn");
    const rawInstructionBtn = $("#addInstructionBtn");
    rawIngredientBtn.removeAttr("id").addClass("template-add-btn").attr("data-role", "ingredient");
    rawInstructionBtn.removeAttr("id").addClass("template-add-btn").attr("data-role", "instruction");

    function makeAddButton(role) {
        return $("<button>")
            .attr("type", "button")
            .addClass("circle-btn add-btn")
            .attr("data-role", role)
            .text("+");
    }

    function rebuildSection(sectionSelector, values, role, placeholderBase) {
        const section = $(sectionSelector);
        section.find(".form-row").remove();
        const count = Math.max(values.length, 3);
        for (let i = 0; i < count; i++) {
            const row = $("<div>").addClass("form-row");
            const input = $("<input>")
                .attr("type", "text")
                .addClass(role === "ingredient" ? "ingredient-input" : "instruction-input")
                .attr("placeholder", `${placeholderBase} #${i + 1}`)
                .val(values[i] || "");
            row.append(input);
            if (i === count - 1) {
                const btn = makeAddButton(role);
                row.append(btn);
            }
            section.append(row);
        }
    }

    rebuildSection(".ingredients-section", recipe.ingredients || [], "ingredient", "Ingredient");
    rebuildSection(".instructions-section", recipe.instructions || [], "instruction", "Instruction");

    $("#attachImageBtn").off("click").on("click", () => $("#recipeFileInput").click());
    $("#recipeFileInput").off("change").on("change", e => {
        const file = e.target.files[0];
        if (!file) return;
        $("#recipeImageInput").val(file.name);
        const reader = new FileReader();
        reader.onload = evt => { recipeImageBase64 = evt.target.result; };
        reader.readAsDataURL(file);
    });

    $(document).off("click", ".add-btn").on("click", ".add-btn", function () {
        const role = $(this).attr("data-role");
        const sectionSelector = role === "ingredient" ? ".ingredients-section" : ".instructions-section";
        const placeholderBase = role === "ingredient" ? "Ingredient" : "Instruction";
        const section = $(sectionSelector);
        const inputs = section.find("input");
        const newIndex = inputs.length + 1;
        const newRow = $("<div>").addClass("form-row");
        const newInput = $("<input>")
            .attr("type", "text")
            .addClass(role === "ingredient" ? "ingredient-input" : "instruction-input")
            .attr("placeholder", `${placeholderBase} #${newIndex}`);
        newRow.append(newInput);
        const clickedBtn = $(this);
        clickedBtn.appendTo(newRow);
        section.append(newRow);
    });

    $("#editRecipeForm").off("submit").on("submit", async e => {
        e.preventDefault();
        const ingredients = $(".ingredient-input").map(function () {
            return $(this).val();
        }).get().filter(v => v != null && v.toString().trim() !== "");
        const instructions = $(".instruction-input").map(function () {
            return $(this).val();
        }).get().filter(v => v != null && v.toString().trim() !== "");
        await updateDoc(recipeRef, {
            title: $("#recipeName").val(),
            description: $("#recipeDescription").val(),
            imageBase64: recipeImageBase64,
            time: $("#recipeTime").val(),
            servings: $("#recipeServings").val(),
            ingredients,
            instructions,
            editTime: serverTimestamp()
        });
        window.location.hash = "#page-your-recipes";
    });
}
