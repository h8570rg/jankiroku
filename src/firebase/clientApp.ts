import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  doc,
  FirestoreDataConverter,
  getDoc as getDocFS,
  getFirestore,
  setDoc as setDocFS,
} from "firebase/firestore";

export const createFirebaseApp = () => {
  const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (getApps().length <= 0) {
    const app = initializeApp(clientCredentials);
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== "undefined") {
      // Enable analytics. https://firebase.google.com/docs/analytics/get-started
      if ("measurementId" in clientCredentials) {
        getAnalytics();
      }
    }
    return app;
  }
};

const app = createFirebaseApp();

// auth
export const auth = getAuth(app);

// db
const firestore = getFirestore(app);

const getDocref = <T>(path: string, ...pathSegments: string[]) => {
  const converter: FirestoreDataConverter<T> = {
    fromFirestore(snapshot, options) {
      return snapshot.data(options) as T;
    },
    toFirestore(model: T) {
      return model;
    },
  };
  return doc(firestore, path, ...pathSegments).withConverter(converter);
};

const getDocSnap = <T>(path: string, ...pathSegments: string[]) =>
  getDocFS(getDocref<T>(path, ...pathSegments));

const getDoc = async <T>(path: string, ...pathSegments: string[]) => {
  try {
    const docSnap = await getDocSnap<T>(path, ...pathSegments);
    return docSnap.data();
  } catch (error) {
    throw error;
  }
};

const setDoc = <T>(data: T, path: string, ...pathSegments: string[]) =>
  setDocFS(getDocref<T>(path, ...pathSegments), data);

export const db = {
  getDoc,
  setDoc,
};
