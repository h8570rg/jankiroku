import {
  doc,
  FirestoreDataConverter,
  getDoc as getDocFS,
  setDoc as setDocFS,
  Firestore,
  QueryDocumentSnapshot,
  DocumentData,
  WithFieldValue,
} from "firebase/firestore";

const converter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  fromFirestore(snapshot: QueryDocumentSnapshot<T>, options): T {
    return snapshot.data(options);
  },
  toFirestore(model: WithFieldValue<T>) {
    return model;
  },
});

export const getFunctions = (firestore: Firestore) => {
  const getDocref = <T extends DocumentData>(
    path: string,
    ...pathSegments: string[]
  ) => {
    return doc(firestore, path, ...pathSegments).withConverter(converter<T>());
  };

  const getDocSnap = <T extends DocumentData>(
    path: string,
    ...pathSegments: string[]
  ) => getDocFS(getDocref<T>(path, ...pathSegments));

  const getDoc = async <T extends DocumentData>(
    path: string,
    ...pathSegments: string[]
  ) => {
    const docSnap = await getDocSnap<T>(path, ...pathSegments);
    return docSnap.data();
  };

  const setDoc = <T extends DocumentData>(
    data: T,
    path: string,
    ...pathSegments: string[]
  ) => setDocFS(getDocref<T>(path, ...pathSegments), data);

  return {
    getDoc,
    setDoc,
  };
};
