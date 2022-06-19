import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminCredentials = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

class App {
  private _app: admin.app.App;

  constructor() {
    if (admin.apps.length === 0) {
      this._app = admin.initializeApp(adminCredentials);
    } else {
      this._app = admin.app();
    }
  }

  get auth() {
    return getAuth(this._app);
  }

  get firestore() {
    return getFirestore(this._app);
  }
}

export default new App();
