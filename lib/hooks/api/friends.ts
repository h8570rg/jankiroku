import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  AddFriendsPayload,
  DeleteFriendsPayload,
  Friend,
} from "~/lib/services/friends";
import { del, get, post } from "~/lib/utils/request";

export const useFriends = (initialData: Friend[]) => {
  return useSWR("/api/friends", (url) => get<Friend[]>(url), {
    fallbackData: initialData,
  });
};

export const useAddFriend = () => {
  return useSWRMutation(
    "/api/friends",
    async (url, { arg }: { arg: AddFriendsPayload }) => {
      await post(url, arg);
    },
  );
};

export const useDeleteFriend = () => {
  return useSWRMutation(
    "/api/friends",
    async (url, { arg }: { arg: DeleteFriendsPayload }) => {
      await del(url, arg);
    },
  );
};
