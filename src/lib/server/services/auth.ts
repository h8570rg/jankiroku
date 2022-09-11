import * as authRepo from "~/lib/server/repositories/auth";
import { AuthInfo } from "~/types";

export const verifyAuthToken = async (
  authToken: string
): Promise<{ success: true; authInfo: AuthInfo } | { success: false }> => {
  try {
    const authInfo: AuthInfo = await authRepo.verifyAuthToken(authToken);
    return {
      success: true,
      authInfo,
    };
  } catch {
    return {
      success: false,
    };
  }
};

export const refreshAuthToken = async (
  refreshToken: string
): Promise<{ success: true; authToken: string } | { success: false }> => {
  try {
    const authToken = await authRepo.refreshAuthToken(refreshToken);
    return {
      success: true,
      authToken,
    };
  } catch {
    return {
      success: false,
    };
  }
};
