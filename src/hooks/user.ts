import useSWR from "swr";
import { fetchUser } from "@/apis/client/users";

export const useUser = (uid: string) =>
  useSWR(`/api/user/${uid}`, (uid) => fetchUser(uid));
