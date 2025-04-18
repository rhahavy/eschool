// /eschool/js/student-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

    const allCards = document.querySelectorAll(".card");
    const totalLessons = allCards.length;
    let completedCount = 0;

    // Initial setup
    allCards.forEach((card) => {
      const lessonId = card.getAttribute("data-lesson-id");
      const checkmark = card.querySelector(".checkmark");
      const button = card.querySelector(".complete-btn");

      const isCompleted = completed[lessonId];

      if (isCompleted) {
        completedCount++;
        checkmark.style.display = "inline";
        button.textContent = "Undo";
        button.classList.add("undo");
      } else {
        button.textContent = "Mark Complete";
        button.classList.remove("undo");
      }

      // Toggle functionality
      button.addEventListener("click", async () => {
        const nowCompleted = !completed[lessonId];

        await updateDoc(userRef, {
          [`completedLessons.${lessonId}`]: nowCompleted
        });

        // Update local state
        completed[lessonId] = nowCompleted;

        // Update UI
        if (nowCompleted) {
          checkmark.style.display = "inline";
          button.textContent = "Undo";
          button.classList.add("undo");
          completedCount++;
        } else {
          checkmark.style.display = "none";
          button.textContent = "Mark Complete";
          button.classList.remove("undo");
          completedCount--;
        }

        // Update progress bar
        const newPercent = Math.round((completedCount / totalLessons) * 100);
        document.getElementById("progress-fill").style.width = `${newPercent}%`;
        document.getElementById("progress-text").innerText =
          `${completedCount} of ${totalLessons} lessons completed` +
          (completedCount === totalLessons ? " 🎉 All done!" : "");
      });
    });

    // Initial progress bar
    const percent = Math.round((completedCount / totalLessons) * 100);
    document.getElementById("progress-fill").style.width = `${percent}%`;
    document.getElementById("progress-text").innerText =
      `${completedCount} of ${totalLessons} lessons completed` +
      (completedCount === totalLessons ? " 🎉 All done!" : "");
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
