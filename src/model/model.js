import $ from "jquery";

import { db, auth } from "../app/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";


export async function changePage(pageName) {
  console.log(`Changing to page: ${pageName}`);
  const file = pageName === "" ? "home" : pageName;

  console.log(`Fetching page snippet from /pages/${file}.htm`);

  try {
    const res = await fetch(`pages/${file}.htm`);
    const data = await res.text();
    console.log(data);

    if ( !res.ok || data.includes('<div id="app">')) {
      $("#place-content").empty();
      alert(`"${file}.htm" is missing!`);
      console.error(`"${file}.htm" page file is missing.`);
      return;
    }

    $("#place-content").html(data);

    if (file === "browse") {
      import("./model.js").then(module => {
        module.fetchRecipes();
      });
    }
  } catch (error) {
    $("#place-content").empty();
    alert(`"${file}.htm" is missing!`);
    console.error(`"${file}.htm" page file is missing.`, error);
  }
}

export async function fetchRecipes() {
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
    const timeA = a.editTime ? new Date(a.editTime).getTime() : 0;
    const timeB = b.editTime ? new Date(b.editTime).getTime() : 0;

    if (timeA !== timeB) {
      return timeB - timeA;
    }

    const titleA = a.title ? a.title.toLowerCase() : "";
    const titleB = b.title ? b.title.toLowerCase() : "";
    if (titleA < titleB) return 1;
    if (titleA > titleB) return -1;
    return 0;
  });

  recipes.forEach(recipe => {
    const recipeHtml = `
      <div class="food-card">
        <img class="card-image" src="../img/recipes/${recipe.imageUrl}" alt="">
        <div class="card-text">
          <div>
            <h3 class="card-title">${recipe.title}</h3>
            <p class="card-description">${recipe.description}</p>
          </div>
          <div class="card-info-row">
            <img class="info-icon" src="../img/clock-icon.png" alt="">
            <span class="info-text">${recipe.time}</span>
          </div>
          <div class="card-info-row">
            <img class="info-icon" src="../img/servings-icon.png" alt="">
            <span class="info-text">${recipe.servings}</span>
          </div>
        </div>
      </div>
    `;
    recipesContainer.append(recipeHtml);
  });
}


export function topnavShowPage(pageName) {
  $("#myTopnav a").removeClass("active");

  const file = pageName === "" ? "home" : pageName;
  const navBtnId = {
    home: "#homeNavBtn",
    browse: "#browseNavBtn",
    "create-recipe": "#createRecipeNavBtn",
  }[file];

  if (navBtnId) {
    $(navBtnId).addClass("active");
  }
}

export function toggleTopnavResponsive() {
  const topnav = $("#myTopnav");
  topnav.toggleClass("responsive");
}

export function topnavShowLoggedIn() {
  $("#loginNavBtn").text("Sign Out");
  $("#loginNavBtn").attr("href", "javascript:void(0)")
}

export function topnavShowSignedOut() {
  $("#loginNavBtn").text("Log In");
  $("#loginNavBtn").attr("href", "#page-login")
}