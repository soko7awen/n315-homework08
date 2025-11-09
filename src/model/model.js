import $ from "jquery";

export async function changePage(pageName) {
  console.log(`Changing to page: ${pageName}`);
  const file = pageName === "" ? "home" : pageName;

  console.log(`Fetching page snippet from /pages/${file}.htm`);

  try {
    const res = await fetch(`/pages/${file}.htm`);
    const data = await res.text();
    console.log(data);

    if (data.includes('<div id="app">')) {
      alert(`"${file}.htm" is missing!`);
      console.error(`"${file}.htm" page file is missing.`);
      return;
    }

    $("#app").html(data);
  } catch (error) {
    alert(`"${file}.htm" is missing!`);
    console.error(`"${file}.htm" page file is missing.`, error);
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