// /eschool/js/admin-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase config (replace with your real config)
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
const db = getFirestore(app);

// 🧾 Lessons to track
const lessonIds = ["grade6-science", "assignment1-rock-layers"];

const tbody = document.getElementById("student-table-body");
const statusMsg = document.getElementById("statusMessage");

async function loadStudents() {
  const usersCol = collection(db, "users");
  const userDocs = await getDocs(usersCol);

  userDocs.forEach((docSnap) => {
    const user = docSnap.data();
    const row = document.createElement("tr");

    // Student name
    const nameCell = document.createElement("td");
    nameCell.textContent = user.firstName || "Unknown";
    row.appendChild(nameCell);

    // Student email
    const emailCell = document.createElement("td");
    emailCell.textContent = user.email || "-";
    row.appendChild(emailCell);

    // Lesson checkboxes
    lessonIds.forEach((lessonId) => {
      const cell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = user.completedLessons?.[lessonId] || false;

      checkbox.addEventListener("change", async () => {
        await updateDoc(doc(db, "users", docSnap.id), {
          [`completedLessons.${lessonId}`]: checkbox.checked,
        });
        showMessage(`Marked "${lessonId}" as ${checkbox.checked ? "complete" : "incomplete"} for ${user.firstName}`);
      });

      cell.appendChild(checkbox);
      row.appendChild(cell);
    });

    // Grade input + save button
    const gradeCell = document.createElement("td");
    const gradeWrapper = document.createElement("div");
    gradeWrapper.style.display = "flex";
    gradeWrapper.style.alignItems = "center";
    gradeWrapper.style.gap = "8px";

    const gradeInput = document.createElement("input");
    gradeInput.type = "text";
    gradeInput.value = user.grades?.["assignment1-rock-layers"] || "";
    gradeInput.style.width = "60px";
    gradeInput.style.padding = "5px";
    gradeInput.style.border = "1px solid #ccc";
    gradeInput.style.borderRadius = "6px";
    gradeInput.style.textAlign = "center";

    // Auto format & color
    gradeInput.addEventListener("input", () => {
      gradeInput.value = gradeInput.value.toUpperCase();
      applyGradeColor(gradeInput.value.trim(), gradeInput);
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style.padding = "5px 10px";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "6px";
    saveBtn.style.backgroundColor = "#d7edcf";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.fontWeight = "bold";

    saveBtn.addEventListener("click", async () => {
      const grade = gradeInput.value.trim();
      await updateDoc(doc(db, "users", docSnap.id), {
        [`grades.assignment1-rock-layers`]: grade
      });
      showMessage(`Grade saved for ${user.firstName}`);
    });

    gradeWrapper.appendChild(gradeInput);
    gradeWrapper.appendChild(saveBtn);
    gradeCell.appendChild(gradeWrapper);
    row.appendChild(gradeCell);

    // Initial color on load
    applyGradeColor(gradeInput.value.trim(), gradeInput);
  });
}

loadStudents();

// ✅ Global helper functions

function showMessage(msg) {
  statusMsg.textContent = msg;
  setTimeout(() => {
    statusMsg.textContent = "";
  }, 3000);
}

function applyGradeColor(grade, inputEl) {
  inputEl.style.backgroundColor = "white";

  // Numeric %
  const percent = parseFloat(grade);
  if (!isNaN(percent)) {
    if (percent >= 80) inputEl.style.backgroundColor = "#e0f8e9"; // green
    else if (percent >= 50) inputEl.style.backgroundColor = "#fffbe0"; // yellow
    else inputEl.style.backgroundColor = "#fce0e0"; // red
    return;
  }

  // Letter grades
  const good = ["A+", "A", "A-", "B+", "B"];
  const ok = ["B-", "C+", "C"];
  const bad = ["D", "F", "R"];

  if (good.includes(grade)) inputEl.style.backgroundColor = "#e0f8e9";
  else if (ok.includes(grade)) inputEl.style.backgroundColor = "#fffbe0";
  else if (bad.includes(grade)) inputEl.style.backgroundColor = "#fce0e0";
}
