import $ from "jquery";

export function changePage(pageName) {
  console.log(`Changing to page: ${pageName}`);
  const file = pageName === "" ? "home" : pageName;

  $.get(`pages/${file}.html`, (data) => {
    if (data.includes('<div id="app">')) {
      alert(`"${file}.html" is missing!`);
      console.error(`"${file}.html" page file is missing.`);
      return;
    }

    $("#app").html(data);
  });
}


export function toggleTopnavResponsive() {
  const topnav = $("#myTopnav");
  if (topnav.className === "topnav") {
    topnav.className += " responsive";
  } else {
    topnav.className = "topnav";
  }
}

export function topnavShowLoggedIn() {
  $("#loginNavBtn").text("Sign Out");
  $("#loginNavBtn").attr("href", "javascript:void(0)")
}

export function topnavShowSignedOut() {
  $("#loginNavBtn").text("Log In");
  $("#loginNavBtn").attr("href", "#page-login")
}