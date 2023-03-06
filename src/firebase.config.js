// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import * as firebase from "firebase";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCTR0NbKvl-BkRSh_7fpjqU2vusBLl1078",
//   authDomain: "house-market-e61c9.firebaseapp.com",
//   projectId: "house-market-e61c9",
//   storageBucket: "house-market-e61c9.appspot.com",
//   messagingSenderId: "142403101495",
//   appId: "1:142403101495:web:286244ccbe5b75900e30b2",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAIapFOMgH77xHu9AQJlz1GTkSOGomInjI",
  authDomain: "homestay-rental-system.firebaseapp.com",
  projectId: "homestay-rental-system",
  storageBucket: "homestay-rental-system.appspot.com",
  messagingSenderId: "889299894737",
  appId: "1:889299894737:web:30b90b009d3857015960f0",
  measurementId: "G-XX8XY9G0C4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
// firebase.initializeApp(firebaseConfig)
// export default firebase;
