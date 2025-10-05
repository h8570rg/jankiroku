import type { Profile } from "@/lib/type";
import type { Supabase } from ".";

export const friendService = (supabase: Supabase) => {
	return {
		getFriends: async (): Promise<Profile[]> => {
			const userResponse = await supabase.auth.getUser();
			if (userResponse.error) throw userResponse.error;
			const user = userResponse.data.user;

			const friendsResponse = await supabase
				.from("friends")
				.select("*, profiles!public_friends_friend_id_fkey!inner(*)")
				.eq("profile_id", user.id);
			if (friendsResponse.error) throw friendsResponse.error;
			const friends = friendsResponse.data;

			return friends.map((friend) => ({
				id: friend.profiles.id,
				name: friend.profiles.name,
				displayId: friend.profiles.display_id,
			}));
		},

		addFriends: async ({ profileId }: { profileId: string }) => {
			const userResponse = await supabase.auth.getUser();
			if (userResponse.error) throw userResponse.error;
			const user = userResponse.data.user;

			const friendExist1Response = await supabase
				.from("friends")
				.select("*")
				.eq("profile_id", user.id)
				.eq("friend_id", profileId)
				.maybeSingle();
			if (friendExist1Response.error) throw friendExist1Response.error;
			const friendExist1 = !!friendExist1Response.data;

			const friendExist2Response = await supabase
				.from("friends")
				.select("*")
				.eq("profile_id", profileId)
				.eq("friend_id", user.id)
				.maybeSingle();
			if (friendExist2Response.error) throw friendExist2Response.error;
			const friendExist2 = !!friendExist2Response.data;

			const createFriend1 = async () => {
				return await supabase.from("friends").insert({
					profile_id: user.id,
					friend_id: profileId,
				});
			};
			const deleteFriend1 = async () => {
				return await supabase
					.from("friends")
					.delete()
					.eq("profile_id", user.id)
					.eq("friend_id", profileId);
			};

			const createFriend2 = async () => {
				return supabase.from("friends").insert({
					profile_id: profileId,
					friend_id: user.id,
				});
			};

			if (friendExist1 && friendExist2) {
				return;
			}

			if (!friendExist1 && !friendExist2) {
				const { error: error1 } = await createFriend1();
				if (error1) throw error1;
				const { error: error2 } = await createFriend2();
				if (error2) {
					const { error } = await deleteFriend1();
					if (error) throw error;
					throw error2;
				}
			}

			if (!friendExist1) {
				await createFriend1();
			}

			if (!friendExist2) {
				await createFriend2();
			}
		},

		deleteFriends: async ({
			profileId,
		}: {
			profileId: string;
		}): Promise<void> => {
			const userResponse = await supabase.auth.getUser();
			if (userResponse.error) throw userResponse.error;
			const user = userResponse.data.user;

			const [userFriendResponse, friendUserResponse] = await Promise.all([
				supabase
					.from("friends")
					.delete()
					.eq("friend_id", profileId)
					.eq("profile_id", user.id),
				supabase
					.from("friends")
					.delete()
					.eq("friend_id", user.id)
					.eq("profile_id", profileId),
			]);
			if (userFriendResponse.error) throw userFriendResponse.error;
			if (friendUserResponse.error) throw friendUserResponse.error;

			return;
		},
	};
};
