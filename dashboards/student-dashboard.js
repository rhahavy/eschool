// /eschool/js/student-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIlkCuaWm1YkomfGape6zl2z7aJrRzwJw",
  authDomain: "eschool-gradebook.firebaseapp.com",
  projectId: "eschool-gradebook",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.body.style.display = "block";

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("welcome").innerText = `Welcome, ${data.firstName}`;
      } else {
        document.getElementById("welcome").innerText = `Welcome, Student`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      document.getElementById("welcome").innerText = `Welcome, Student`;
    }
  } else {
    // Not logged in? Redirect to login page
    window.location.href = "/eschool/auth/login.html";
  }
});

// Logout button
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "/eschool/auth/login.html";
  });
});
