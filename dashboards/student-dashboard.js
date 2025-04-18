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

    allCards.forEach((card) => {
      const lessonId = card.getAttribute("data-lesson-id");
      const checkmark = card.querySelector(".checkmark");
      const button = card.querySelector(".complete-btn");

      if (completed[lessonId]) {
        completedCount++;
        checkmark.style.display = "inline";
        button.style.display = "none";
      }

      // ✅ Handle click on "Mark Complete"
      button.addEventListener("click", async () => {
        await updateDoc(userRef, {
          [`completedLessons.${lessonId}`]: true
        });

        // Update UI
        checkmark.style.display = "inline";
        button.style.display = "none";

        // Update progress bar
        completedCount++;
        const newPercent = Math.round((completedCount / totalLessons) * 100);
        document.getElementById("progress-fill").style.width = `${newPercent}%`;
        document.getElementById("progress-text").innerText = `${completedCount} of ${totalLessons} lessons completed`;
      });
    });

    // ✅ Initial progress bar update
    const percent = Math.round((completedCount / totalLessons) * 100);
    document.getElementById("progress-fill").style.width = `${percent}%`;
    document.getElementById("progress-text").innerText = `${completedCount} of ${totalLessons} lessons completed`;

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
