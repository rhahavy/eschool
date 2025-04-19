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

const loginForm = document.getElementById("login-form");
const errorDisplay = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    // 🔒 Make sure the session stays active after reload
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ Logged in:", user.uid);

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("No Firestore user profile found.");

    const role = userDoc.data().role;
    console.log("🎭 User role:", role);

    if (role === "admin") {
      window.location.href = "/eschool/dashboards/admin-dashboard.html";
    } else if (role === "student") {
      window.location.href = "/eschool/dashboards/student-dashboard.html";
    } else {
      throw new Error("Unrecognized user role.");
    }
  } catch (err) {
    console.error("❌ Login failed:", err);
    errorDisplay.textContent = "Login failed: " + err.message;
  }
});
