// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAxwE3p_PQytmdKAapGzvI6WlO0GjbonNU",
    authDomain: "royal-jewels-f7b84.firebaseapp.com",
    projectId: "royal-jewels-f7b84",
    storageBucket: "royal-jewels-f7b84.firebasestorage.app",
    messagingSenderId: "81024864684",
    appId: "1:81024864684:web:73853dbc063ce32b1a2a09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Helper (With Mobile Popup-to-Redirect Fallback)
export const loginWithGoogle = async () => {
    try {
        // Pehle desktop/normal tareeqe se popup try karega
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.warn("Popup blocked or failed, switching to redirect method...", error.code);

        // Agar mobile hai ya popup block ho gaya hai, toh redirect method use hoga
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request' || /Mobi|Android/i.test(navigator.userAgent)) {
            try {
                await signInWithRedirect(auth, googleProvider);
            } catch (redirectError) {
                console.error("Firebase Redirect Error:", redirectError);
                throw redirectError;
            }
        } else {
            throw error;
        }
    }
};

// Logout Helper
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase Logout Error:", error);
        throw error;
    }
};