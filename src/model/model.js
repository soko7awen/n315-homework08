import $ from "jquery";

export async function changePage(pageId, params) {
  console.log(`Changing to page: ${pageId}`);
  const file = pageId === "" ? "home" : pageId;

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

  switch (file) {
    case "browse":
      import("../app/browse.js").then(module => {
        module.initBrowsePage();
      });
      break;

    case "create-recipe":
      import("../app/createRecipe.js").then(module => {
        module.initCreateRecipePage();
      });
      break;

    case "your-recipes":
      import("../app/yourRecipes.js").then(module => {
        module.initYourRecipesPage();
      });
      break;

    case "edit-recipe":
      import("../app/editRecipe.js").then(module => {
        module.initEditRecipePage(params);
      });
      break;

    case "view-recipe":
      import("../app/viewRecipe.js").then(module => {
        module.initViewRecipePage(params);
      });
      break;
  }
  } catch (error) {
    $("#place-content").empty();
    alert(`"${file}.htm" is missing!`);
    console.error(`"${file}.htm" page file is missing.`, error);
  }
}

export function topnavShowPage(pageId) {
  $("#myTopnav a").removeClass("active");

  const file = pageId === "" ? "home" : pageId;

  let camelCaseId = file.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  camelCaseId = (camelCaseId === "editRecipe" || camelCaseId === "viewRecipe") ? "yourRecipes" : camelCaseId;
  const navBtnId = `#${camelCaseId}NavBtn`;

  if ($(navBtnId).length) {
    $(navBtnId).addClass("active");
  }
}

export function toggleTopnavResponsive() {
  const topnav = $("#myTopnav");
  topnav.toggleClass("responsive");
}

export function topnavShowLoggedIn() {
  $("#loginNavBtn").text("Logout");
  $("#loginNavBtn").attr("href", "javascript:void(0)");
  $("#yourRecipesNavBtn").parent().removeClass("hidden");
}

export function topnavShowSignedOut() {
  $("#loginNavBtn").text("Log In");
  $("#loginNavBtn").attr("href", "#page-login");
  $("#yourRecipesNavBtn").parent().addClass("hidden");
}