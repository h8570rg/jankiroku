import admin from "firebase-admin";
import { getFirestore as getFirebaseFirestore } from "firebase-admin/firestore";
import { getFunctions } from "./functions";

export const getFirestore = (firebaseApp: admin.app.App) => {
  const firestore = getFirebaseFirestore(firebaseApp);
  const functions = getFunctions(firestore);

  return {
    ...functions,
  };
};
