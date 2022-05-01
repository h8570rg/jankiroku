export type Auth = {
  loadingUser: boolean;
  signedIn: boolean;
  signOut: VoidFunction;
  user: User | undefined;
};

export type User = {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
};
