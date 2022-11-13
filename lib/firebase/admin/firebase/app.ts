import admin from "firebase-admin";
import { config, Config } from "~/lib/config";
import { getAuth } from "./auth";
import { getFirestore } from "./firestore";

class App {
  private _app: admin.app.App;

  constructor(config: Config) {
    const adminCredentials = {
      credential: admin.credential.cert({
        projectId: config.public.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    };

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

export const app = new App(config);
