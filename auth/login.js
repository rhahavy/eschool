// /eschool/js/login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIlkCuaWm1YkomfGape6zl2z7aJrRzwJw",
  authDomain: "eschool-gradebook.firebaseapp.com",
  projectId: "eschool-gradebook",
  storageBucket: "eschool-gradebook.firebasestorage.app",
  messagingSenderId: "37242341415",
  appId: "1:37242341415:web:5cc1863e6615874d84a602",
  measurementId: "G-CRTK5FD726"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login handler
const loginForm = document.getElementById("login-form");
const errorDisplay = document.getElementById("error");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found in Firestore.");
    }

    const userData = userSnap.data();
    const role = userData.role || "student";

    // Store login info
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);

    // Redirect based on role
    if (role === "admin") {
      window.location.href = "/eschool/dashboards/admin-dashboard.html";
    } else {
      window.location.href = "/eschool/dashboards/student-dashboard.html";
    }

  } catch (error) {
    errorDisplay.textContent = "Login failed: " + error.message;
  }
});
