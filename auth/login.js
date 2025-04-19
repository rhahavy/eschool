// /eschool/auth/login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Full Firebase config
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

// ✅ Target your login form and error display
const loginForm = document.getElementById("login-form");
const errorDisplay = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    // ✅ Ensure session persists
    await setPersistence(auth, browserLocalPersistence);

    // ✅ Try login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ Logged in:", user.uid);

    // ✅ Fetch role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("No Firestore user profile found.");
    }

    const role = userDoc.data().role;
    console.log("🎭 User role:", role);

    // ✅ DEBUG mode – stop here before redirecting
    if (role === "admin") {
      console.log("✅ Would redirect to admin dashboard");
      alert("You are admin. Stopping here for debugging.");
      return;
    }

    if (role === "student") {
      console.log("✅ Would redirect to student dashboard");
      alert("You are student. Stopping here for debugging.");
      return;
    }

    throw new Error("Unrecognized user role: " + role);
  } catch (err) {
    console.error("❌ Login failed:", err);
    errorDisplay.textContent = "Login failed: " + err.message;
  }
});
