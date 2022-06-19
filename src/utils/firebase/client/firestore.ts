import {
  doc,
  FirestoreDataConverter,
  getDoc as getDocFS,
  setDoc as setDocFS,
} from "firebase/firestore";
import app from "./app";

const firestore = app.firestore;

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
  const docSnap = await getDocSnap<T>(path, ...pathSegments);
  return docSnap.data();
};

const setDoc = <T>(data: T, path: string, ...pathSegments: string[]) =>
  setDocFS(getDocref<T>(path, ...pathSegments), data);

export { getDoc, setDoc };
