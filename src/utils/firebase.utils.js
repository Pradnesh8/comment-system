// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBcLk4H99Oyfo7yifxKxedcgGN-tgNiLk",
    authDomain: "comment-system-assessment.firebaseapp.com",
    projectId: "comment-system-assessment",
    storageBucket: "comment-system-assessment.appspot.com",
    messagingSenderId: "360940999923",
    appId: "1:360940999923:web:175703b3ea5009ed279386"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
    prompt: "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);