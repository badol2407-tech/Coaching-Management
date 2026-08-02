const firebaseApiKey =
  import.meta.env.FIREBASE_API_KEY ??
  import.meta.env.VITE_FIREBASE_API_KEY ??
  import.meta.env.VITE_FIREBASE_API;

export const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "coaching-management-d2d0f.firebaseapp.com",
  databaseURL:
    "https://coaching-management-d2d0f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coaching-management-d2d0f",
  storageBucket: "coaching-management-d2d0f.firebasestorage.app",
  messagingSenderId: "925702189239",
  appId: "1:925702189239:web:9f6b4606bf07d995fc9d32",
};