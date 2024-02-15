// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-FrS-5sXs-i9W6f7J8aahij2se_dRAPo",
    authDomain: "udana-chatapp.firebaseapp.com",
    projectId: "udana-chatapp",
    storageBucket: "udana-chatapp.appspot.com",
    messagingSenderId: "1021052692406",
    appId: "1:1021052692406:web:ce87f7b56cbf7cf87dc317"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app);

export { app, auth};