// /eschool/js/admin-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

const lessonIds = ["grade6-science", "assignment1-rock-layers"];
const tbody = document.getElementById("student-table-body");
const statusMsg = document.getElementById("statusMessage");

function showMessage(msg) {
  statusMsg.textContent = msg;
  setTimeout(() => {
    statusMsg.textContent = "";
  }, 3000);
}

function applyGradeColor(grade, inputEl) {
  inputEl.style.backgroundColor = "white";
  const percent = parseFloat(grade);
  if (!isNaN(percent)) {
    if (percent >= 80) inputEl.style.backgroundColor = "#e0f8e9";
    else if (percent >= 50) inputEl.style.backgroundColor = "#fffbe0";
    else inputEl.style.backgroundColor = "#fce0e0";
    return;
  }
  const good = ["A+", "A", "A-", "B+", "B"];
  const ok = ["B-", "C+", "C"];
  const bad = ["D", "F", "R"];
  if (good.includes(grade)) inputEl.style.backgroundColor = "#e0f8e9";
  else if (ok.includes(grade)) inputEl.style.backgroundColor = "#fffbe0";
  else if (bad.includes(grade)) inputEl.style.backgroundColor = "#fce0e0";
}

async function loadStudents() {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    snapshot.forEach((docSnap) => {
      const user = docSnap.data();
      if (user.role === "admin") return; // skip admins

      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = user.firstName || "Unknown";
      row.appendChild(nameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email || "-";
      row.appendChild(emailCell);

      lessonIds.forEach((lessonId) => {
        const cell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = user.completedLessons?.[lessonId] || false;

        checkbox.addEventListener("change", async () => {
          await updateDoc(doc(db, "users", docSnap.id), {
            [`completedLessons.${lessonId}`]: checkbox.checked
          });
          showMessage(`Marked ${lessonId} as ${checkbox.checked ? "complete" : "incomplete"} for ${user.firstName}`);
        });

        cell.appendChild(checkbox);
        row.appendChild(cell);
      });

      const gradeCell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.value = user.grades?.["assignment1-rock-layers"] || "";
      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase();
        applyGradeColor(input.value.trim(), input);
      });
      applyGradeColor(input.value.trim(), input);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "save-btn";
      saveBtn.addEventListener("click", async () => {
        await updateDoc(doc(db, "users", docSnap.id), {
          [`grades.assignment1-rock-layers`]: input.value.trim()
        });
        showMessage(`Grade saved for ${user.firstName}`);
      });

      gradeCell.appendChild(input);
      gradeCell.appendChild(saveBtn);
      row.appendChild(gradeCell);

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Error loading students:", err);
    showMessage("Failed to load student data.");
  }
}

loadStudents();
