import { FirebaseApp } from "firebase/app";
import { getFirestore as getFirebaseFirestore } from "firebase/firestore";
import { getFunctions } from "./functions";

export const getFirestore = (firebaseApp: FirebaseApp) => {
  const firestore = getFirebaseFirestore(firebaseApp);
  const functions = getFunctions(firestore);

  return {
    ...functions,
  };
};
