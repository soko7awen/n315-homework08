import '../scss/styles.scss';

import $ from "jquery";

import { changePage, toggleTopnavResponsive, topnavShowLoggedIn, topnavShowSignedOut } from "../model/model.js";
import { app, auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


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
      .then(async (cred)  => {
        console.log("signed in success");
        alert(`Welcome back, ${cred.user.displayName}!`);
        window.location.hash = "#page-home";
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
    const firstName = $("#signupFirstName").val();
    const lastName = $("#signupLastName").val();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        await updateProfile(cred.user, { displayName: firstName });
        console.log(cred.user.displayName);
        alert(`Thanks for signing up, ${cred.user.displayName}!`);
        await setDoc(doc(db, "users", cred.user.uid), {
          firstName,
          lastName,
          email
        });
        window.location.hash = "#page-home";
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
  setTimeout(() => {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#page-", "");
    changePage(pageID);
  }, 80);
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
