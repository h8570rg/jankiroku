import useSWR from "swr";
import { fetchUser } from "~/repositories/user";

export const useUser = (uid: string) =>
  useSWR(`/api/user/${uid}`, (uid) => fetchUser(uid));
