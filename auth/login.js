// /eschool/js/login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIlkCuaWm1YkomfGape6zl2z7aJrRzwJw",
  authDomain: "eschool-gradebook.firebaseapp.com",
  projectId: "eschool-gradebook",
  storageBucket: "eschool-gradebook.firebasestorage.app",
  messagingSenderId: "37242341415",
  appId: "1:37242341415:web:5cc1863e6615874d84a602",
  measurementId: "G-CRTK5FD726"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("login-form");
const errorDisplay = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    console.log("📨 Logging in with:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ Firebase Auth success", user.uid);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("⚠️ No Firestore profile found.");
    }

    const userData = userSnap.data();
    console.log("📘 Firestore data:", userData);

    const role = userData.role || "student";
    console.log("🎭 Role detected:", role);

    if (role === "admin") {
      console.log("➡️ Redirecting to ADMIN dashboard...");
      window.location.href = "/eschool/dashboards/admin-dashboard.html";
    } else {
      console.log("➡️ Redirecting to STUDENT dashboard...");
      window.location.href = "/eschool/dashboards/student-dashboard.html";
    }

  } catch (error) {
    console.error("❌ Login Error:", error);
    errorDisplay.textContent = "Login failed: " + error.message;
  }
});
