// /eschool/js/admin-dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase config (use your real values here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "eschool-gradebook.firebaseapp.com",
  projectId: "eschool-gradebook",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📘 Lessons we want to track
const lessonIds = ["grade6-science", "assignment1-rock-layers"];

const tbody = document.getElementById("student-table-body");
const statusMsg = document.getElementById("statusMessage");

async function loadStudents() {
  const usersCol = collection(db, "users");
  const userDocs = await getDocs(usersCol);

  userDocs.forEach((docSnap) => {
    const user = docSnap.data();
    const row = document.createElement("tr");

    // Student Name
    const nameCell = document.createElement("td");
    nameCell.textContent = user.firstName || "Unknown";
    row.appendChild(nameCell);

    // Student Email
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

    // Grade input
    const gradeCell = document.createElement("td");
    const gradeInput = document.createElement("input");
    gradeInput.type = "text";
    gradeInput.value = user.grades?.["assignment1-rock-layers"] || "";

    gradeInput.addEventListener("blur", async () => {
      const grade = gradeInput.value.trim();
      await updateDoc(doc(db, "users", docSnap.id), {
        [`grades.assignment1-rock-layers`]: grade
      });
      showMessage(`Updated grade for ${user.firstName}`);
    });

    gradeCell.appendChild(gradeInput);
    row.appendChild(gradeCell);

    tbody.appendChild(row);
  });
}

function showMessage(msg) {
  statusMsg.textContent = msg;
  setTimeout(() => {
    statusMsg.textContent = "";
  }, 3000);
}

loadStudents();
