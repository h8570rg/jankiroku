/**
 * @see https://googleapis.dev/nodejs/firestore/latest/
 */

import {
  FirestoreDataConverter,
  Firestore,
  QueryDocumentSnapshot,
  DocumentData,
  WithFieldValue,
} from "firebase-admin/firestore";

const converter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  fromFirestore(snapshot: QueryDocumentSnapshot<T>): T {
    return snapshot.data();
  },
  toFirestore(model: WithFieldValue<T>) {
    return model;
  },
});

export const getFunctions = (firestore: Firestore) => {
  const getDocRef = <T extends DocumentData>(
    path: string,
    ...pathSegments: string[]
  ) => {
    return firestore
      .doc([path, ...pathSegments].join("/"))
      .withConverter(converter<T>());
  };

  const getDocSnap = <T extends DocumentData>(
    path: string,
    ...pathSegments: string[]
  ) => getDocRef<T>(path, ...pathSegments).get();

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
  ) => getDocRef<T>(path, ...pathSegments).create(data);

  return {
    getDoc,
    setDoc,
  };
};
