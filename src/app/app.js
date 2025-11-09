import $ from "jquery";
import { changePage, toggleTopnavResponsive, topnavShowLoggedIn, topnavShowSignedOut } from "../model/model.js";
import { app, auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

function initListeners() {
  $("#app").on("click", "#myTopNavIcon", function (e) {
    e.preventDefault();
    toggleTopnavResponsive();
  });

  $("#app").on("submit", "#loginForm", (e) => {
    e.preventDefault();

    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert(`Welcome back, ${email}!`);
        console.log("signed in success");
        window.location.hash = "#page-home";
        window.location.reload();
      })
      .catch((error) => {
        alert(`Login failed: ${error.message}`);
        console.log("error signing in: ", error);
      });
  });

  $("#app").on("submit", "#signupForm", (e) => {
    e.preventDefault();
    
    const email = $("#signupEmail").val();
    const password = $("#signupPassword").val();

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("signed up success");
        window.location.hash = "#page-home";
        window.location.reload();
      })
      .catch((error) => {
        console.log("error signing up: ", error);
      });
  });

  $("#app").on("click", "#loginNavBtn", () => {
    if (auth.currentUser) {
      console.log("loginNavBtn used to sign out");
      signOut(auth)
      .then(() => {
        console.log("sign out success");
        window.location.reload();
      }).catch((error) => {
        console.log("error signing out:", error);
      })
    }
  });
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#page-", "");
  changePage(pageID);
}

function initRouting() {
  $(window).on("hashchange", route);
  route();
}

$(document).ready(function () {
  initRouting();
  initListeners();
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.email);
    topnavShowLoggedIn();

  } else {
    console.log("none user");
    topnavShowSignedOut();
  }
});
