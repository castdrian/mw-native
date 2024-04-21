import { useCallback, useMemo } from "react";

import type {
  AccountWithToken,
  BookmarkMediaItem,
  ProgressMediaItem,
  SessionResponse,
  UserResponse,
} from "@movie-web/api";
import {
  base64ToBuffer,
  bookmarkMediaToInput,
  bytesToBase64,
  bytesToBase64Url,
  decryptData,
  encryptData,
  getBookmarks,
  getLoginChallengeToken,
  getProgress,
  getRegisterChallengeToken,
  getSettings,
  getUser,
  importBookmarks,
  importProgress,
  keysFromMnemonic,
  loginAccount,
  progressMediaItemToInputs,
  registerAccount,
  removeSession,
  signChallenge,
} from "@movie-web/api";

import { useAuthStore } from "~/stores/settings";
import { useAuthData } from "./useAuthData";

export interface RegistrationData {
  recaptchaToken?: string;
  mnemonic: string;
  userData: {
    device: string;
    profile: {
      colorA: string;
      colorB: string;
      icon: string;
    };
  };
}

export interface LoginData {
  mnemonic: string;
  userData: {
    device: string;
  };
}

export function useAuth() {
  const currentAccount = useAuthStore((s) => s.account);
  const profile = useAuthStore((s) => s.account?.profile);
  const loggedIn = !!useAuthStore((s) => s.account);
  const backendUrl = useAuthStore((s) => s.backendUrl);
  const {
    logout: userDataLogout,
    login: userDataLogin,
    syncData,
  } = useAuthData();

  const login = useCallback(
    async (loginData: LoginData) => {
      if (!backendUrl) return;
      const keys = await keysFromMnemonic(loginData.mnemonic);
      const publicKeyBase64Url = bytesToBase64Url(keys.publicKey);
      const { challenge } = await getLoginChallengeToken(
        backendUrl,
        publicKeyBase64Url,
      );
      const signature = signChallenge(keys, challenge);
      const loginResult = await loginAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature,
        },
        publicKey: publicKeyBase64Url,
        device: await encryptData(loginData.userData.device, keys.seed),
      });

      const user = await getUser(backendUrl, loginResult.token);
      const seedBase64 = bytesToBase64(keys.seed);
      return userDataLogin(loginResult, user.user, user.session, seedBase64);
    },
    [userDataLogin, backendUrl],
  );

  const logout = useCallback(async () => {
    if (!currentAccount || !backendUrl) return;
    try {
      await removeSession(
        backendUrl,
        currentAccount.token,
        currentAccount.sessionId,
      );
    } catch {
      // we dont care about failing to delete session
    }
    userDataLogout();
  }, [userDataLogout, backendUrl, currentAccount]);

  const register = useCallback(
    async (registerData: RegistrationData) => {
      if (!backendUrl) return;
      const { challenge } = await getRegisterChallengeToken(
        backendUrl,
        registerData.recaptchaToken,
      );
      const keys = await keysFromMnemonic(registerData.mnemonic);
      const signature = signChallenge(keys, challenge);
      const registerResult = await registerAccount(backendUrl, {
        challenge: {
          code: challenge,
          signature,
        },
        publicKey: bytesToBase64Url(keys.publicKey),
        device: await encryptData(registerData.userData.device, keys.seed),
        profile: registerData.userData.profile,
      });

      return userDataLogin(
        registerResult,
        registerResult.user,
        registerResult.session,
        bytesToBase64(keys.seed),
      );
    },
    [backendUrl, userDataLogin],
  );

  const importData = useCallback(
    async (
      account: AccountWithToken,
      progressItems: Record<string, ProgressMediaItem>,
      bookmarks: Record<string, BookmarkMediaItem>,
    ) => {
      if (!backendUrl) return;
      if (
        Object.keys(progressItems).length === 0 &&
        Object.keys(bookmarks).length === 0
      ) {
        return;
      }

      const progressInputs = Object.entries(progressItems).flatMap(
        ([tmdbId, item]) => progressMediaItemToInputs(tmdbId, item),
      );

      const bookmarkInputs = Object.entries(bookmarks).map(([tmdbId, item]) =>
        bookmarkMediaToInput(tmdbId, item),
      );

      await Promise.all([
        importProgress(backendUrl, account, progressInputs),
        importBookmarks(backendUrl, account, bookmarkInputs),
      ]);
    },
    [backendUrl],
  );

  const restore = useCallback(
    async (account: AccountWithToken) => {
      if (!backendUrl) return;
      let user: { user: UserResponse; session: SessionResponse };
      try {
        user = await getUser(backendUrl, account.token);
      } catch (err) {
        const anyError = err as { response?: { status: number } };
        if (
          anyError?.response?.status === 401 ||
          anyError?.response?.status === 403 ||
          anyError?.response?.status === 400
        ) {
          await logout();
          return;
        }
        console.error(err);
        throw err;
      }

      const [bookmarks, progress, settings] = await Promise.all([
        getBookmarks(backendUrl, account),
        getProgress(backendUrl, account),
        getSettings(backendUrl, account),
      ]);

      syncData(user.user, user.session, progress, bookmarks, settings);
    },
    [backendUrl, syncData, logout],
  );

  const decryptedName = useMemo(() => {
    if (!currentAccount) return "";
    return decryptData(
      currentAccount.deviceName,
      base64ToBuffer(currentAccount.seed),
    );
  }, [currentAccount]);

  return {
    loggedIn,
    profile,
    decryptedName,
    login,
    logout,
    register,
    restore,
    importData,
  };
}
