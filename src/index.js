import { Notyf } from "notyf"; // For notifications
// import 'notyf/notyf.min.css';

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot, // Real-time Data Update
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc, // NOTE: getDoc is used to get a document from the database, while getDocs is used to get multiple documents from the database
  updateDoc, // NOTE: updateDoc is used to update a document in the database.
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// GLOBAL VARIABLES
const bookList = document.querySelector(".book-list");
// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBhwEKHQ_LOtCUfKcrw0PxhOBKhZklk-qY",
  authDomain: "learn-fire-1a715.firebaseapp.com",
  projectId: "learn-fire-1a715",
  storageBucket: "learn-fire-1a715.appspot.com",
  messagingSenderId: "303072006307",
  appId: "1:303072006307:web:db6b0e2b79d6b748ccaf16",
};

// init firebase app
initializeApp(firebaseConfig);

// init firestore service

const db = getFirestore();
const auth = getAuth();

// collection ref = [Book ref in this scenario]
const bookRef = collection(db, "books");

// queries
// const authorQuery = query(bookRef, orderBy("createdAt", "desc"));

// where("author", "==", "Mr. Pepe"), SYNTAX FOR USING WHERE

// get  collection data

/*
getDocs(bookRef)
  .then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
  })
  .catch((err) => {
    console.log(err.message);
  });
*/

// get real-time data based on query
// onSnapshot(authorQuery, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// Get Real-time collection data
const unsubBook = onSnapshot(query(bookRef, orderBy("createdAt", "desc")), (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);

  bookList.innerHTML = books
    .map(
      (book) => `<li>
    <p class="font-bold">${book.title}</p> By: <span class="text-sm">${book.author}</span> <p>ID: <span class="text-sm select-all">${book.id}</span></p></li>`
    )
    .join("");
});

//   Adding documents
const addForm = document.querySelector(".add");

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(bookRef, {
    title: addForm.title.value,
    author: addForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addForm.reset();
    Toastify({
      text: `Book Added!`,
      duration: 3000,
      close: true,
      className: "bg-slate-800 font-bold",
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#0f172a",
        color: "#fff",
        boxShadow: "0px 1px 20px rgba(0,0,0,0.2)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  });
});

// Deleting documents
const deleteForm = document.querySelector(".delete");

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const bookDocRef = doc(db, "books", deleteForm.id.value);

  deleteDoc(bookDocRef).then(() => {
    deleteForm.reset();
    Toastify({
      text: `Book Deleted!`,
      duration: 3000,
      close: true,
      className: "bg-slate-800 font-bold",
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#c2410c",
        color: "#fff",
        boxShadow: "0px 1px 20px rgba(0,0,0,0.2)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  });
});

/*
  GET A SINGLE DOCUMENT:
  const docRef = doc(db, collectionName, "bookId")

  getDoc(docRef)
    .then((doc) => {
      console.log(doc.data(), doc.id);
    })
    .catch((err) => {
      console.log(err.message);
    })
*/

const docRef = doc(db, "books", "xfFv4ifiHPakovflGrk7");

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// We can also get real-time data for a single document
onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// UPDATING A DOCUMENT (10/15)

var updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    author: prompt("Enter new author: "),
    title: prompt("Enter new title: "),
  }).then(() => {
    updateForm.reset();
    Toastify({
      text: `Book Updated!`,
      duration: 3000,
      close: true,
      className: "bg-slate-800 font-bold",
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "springgreen",
        color: "#fff",
        boxShadow: "0px 1px 20px rgba(0,0,0,0.2)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  });
});

// FIREBASE AUTH

const signUpForm = document.querySelector(".signup");

// Signing users up
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signUpForm.email.value;
  const password = signUpForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log(`User created: ${cred.user.email}`);
      signUpForm.reset();
      alert("Account Created, You can now login with the credentials");
    })
    .catch((err) => {
      console.log(err.message);
    });

  // Voila! you have a perfect authentication setup for your web app
});

// Login in and Logging out

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log(`${cred.user.email} successfully signed in`);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // console.log("The user is signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Monitoring Real-time authentication changes
onAuthStateChanged(auth, (user) => {
  user
    ? (console.log(`${user.email} logged in!`),
      (loginForm.style.display = "none"),
      (signUpForm.style.display = "none"),
      (logoutBtn.style.display = "flex"))
    : (console.log(`We hope to see you again`),
      (loginForm.style.display = "flex"),
      (signUpForm.style.display = "flex"),
      (logoutBtn.style.display = "none"));
});


// Unsubscribing from changes (auth & db)

const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  unsubBook();
  console.log('unsubscribed')
})