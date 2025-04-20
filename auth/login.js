import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;
      console.log("Role:", role);

      if (role === "student") {
        // ✅ Redirect to student dashboard
        window.location.href = "student-dashboard.html";
      } else if (role === "teacher") {
        // Optional: Redirect teachers
        window.location.href = "teacher-dashboard.html";
      }
    } else {
      console.log("No such document!");
    }
  } else {
    console.log("No user is signed in.");
  }
});
