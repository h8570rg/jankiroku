// import { getAnalytics } from "firebase/analytics";
import { initializeApp, FirebaseApp } from "firebase/app";
import { Config, config } from "~/core/config";
import { getAuth } from "./auth";
import { getFirestore } from "./firestore";

class App {
  private _app: FirebaseApp;

  constructor(config: Config) {
    const clientCredentials = {
      apiKey: config.public.firebase.apiKey,
      authDomain: config.public.firebase.authDomain,
      databaseURL: config.public.firebase.databaseURL,
      projectId: config.public.firebase.projectId,
      storageBucket: config.public.firebase.storageBucket,
      messagingSenderId: config.public.firebase.messagingSenderId,
      appId: config.public.firebase.appId,
      measurementId: config.public.firebase.measurementId,
    };

    this._app = initializeApp(clientCredentials);

    // Check that `window` is in scope for the analytics module!
    if (typeof window !== "undefined") {
      // Enable analytics. https://firebase.google.com/docs/analytics/get-started
      // if ("measurementId" in clientCredentials) {
      //   getAnalytics();
      // }
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
