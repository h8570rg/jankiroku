import { DecodedIdToken } from "firebase-admin/auth";

export type User = {
  uid: string;
  jrId: string;
  name: string;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
};

export type AuthInfo = DecodedIdToken;
