// /eschool/js/student-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
  if (!user) {
    window.location.href = "/eschool/auth/login.html";
    return;
  }

  document.body.style.display = "block";
  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById("welcome").innerText = `Welcome, ${data.firstName}`;
    const completed = data.completedLessons || {};

    // 🔁 Loop through each card on the page
    document.querySelectorAll(".card").forEach((card) => {
      const lessonId = card.getAttribute("data-lesson-id");
      const checkmark = card.querySelector(".checkmark");
      const button = card.querySelector(".complete-btn");

      // Show ✅ if completed
      if (completed[lessonId]) {
        checkmark.style.display = "inline";
        button.style.display = "none";
      }

      // Handle click
      button.addEventListener("click", async () => {
        await updateDoc(userRef, {
          [`completedLessons.${lessonId}`]: true
        });
        checkmark.style.display = "inline";
        button.style.display = "none";
      });
    });

  } else {
    document.getElementById("welcome").innerText = `Welcome, Student`;
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "/eschool/auth/login.html";
  });
});
