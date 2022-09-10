import * as userRepo from "~/repositories/user";

// TODO: uidをcontextから取るように
export const getMe = (uid: string) => userRepo.fetchUser(uid);

// export const createUser = (authInfo: AuthInfo) => {
//   if (isAnonymous(authInfo)) {
//     const user: User = {
//       uid: authInfo.uid,
//       jrId:
//     }
//   }
//   userRepo.createUser(user);
// }
