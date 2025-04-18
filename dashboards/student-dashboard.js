// /eschool/js/student-dashboard.js (debugged version)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

console.log("📦 student-dashboard.js loaded");

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

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("⚠️ No user logged in — redirecting to login.html");
    window.location.href = "../auth/login.html";
    return;
  }

  console.log("✅ Authenticated as:", user.email);
  document.body.style.display = "block";

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.error("❌ No Firestore document found for UID:", uid);
    document.getElementById("welcome").innerText = "Welcome, Student";
    return;
  }

  const data = userSnap.data();
  console.log("📄 Firestore data:", data);

  if (data.role === "admin") {
    console.warn("🚫 Admin user tried to access student dashboard — redirecting");
    window.location.href = "../dashboards/admin-dashboard.html";
    return;
  }

  document.getElementById("welcome").innerText = `Welcome, ${data.firstName || 'Student'}`;
  const completed = data.completedLessons || {};

  const allCards = document.querySelectorAll(".card");
  const totalLessons = allCards.length;
  let completedCount = 0;

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

    button.addEventListener("click", async () => {
      const nowCompleted = !completed[lessonId];

      await updateDoc(userRef, {
        [`completedLessons.${lessonId}`]: nowCompleted
      });

      completed[lessonId] = nowCompleted;

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

      const newPercent = Math.round((completedCount / totalLessons) * 100);
      document.getElementById("progress-fill").style.width = `${newPercent}%`;
      document.getElementById("progress-text").innerText =
        `${completedCount} of ${totalLessons} lessons completed` +
        (completedCount === totalLessons ? " 🎉 All done!" : "");
    });
  });

  const percent = Math.round((completedCount / totalLessons) * 100);
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("progress-text").innerText =
    `${completedCount} of ${totalLessons} lessons completed` +
    (completedCount === totalLessons ? " 🎉 All done!" : "");
});

// Logout handler
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("👋 Logged out, redirecting to login page");
      window.location.href = "../auth/login.html";
    });
  });
} else {
  console.error("❌ Logout button not found in DOM");
}
