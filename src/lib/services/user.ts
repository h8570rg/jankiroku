import * as userRepo from "~/lib/repositories/user";

export const getUser = (uid: string) => userRepo.fetchUser(uid);

// export const createUser = (authInfo: AuthInfo) => {
//   if (isAnonymous(authInfo)) {
//     const user: User = {
//       uid: authInfo.uid,
//       jrId:
//     }
//   }
//   userRepo.createUser(user);
// }
