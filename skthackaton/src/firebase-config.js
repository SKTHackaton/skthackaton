import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDja8wn_WIL3OCtrGGg92P9gYtA3AGx-lQ",
    authDomain: "skthackaton-5ee5a.firebaseapp.com",
    projectId: "skthackaton-5ee5a",
    storageBucket: "skthackaton-5ee5a.appspot.com",
    messagingSenderId: "215406750352",
    appId: "1:215406750352:web:7e1f9c3a4f43195cb5c615",
    measurementId: "G-L8CCH5C6B4"  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };