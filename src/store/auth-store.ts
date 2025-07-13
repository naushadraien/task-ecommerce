import {
  ACCESS_TOKEN,
  AUTH_STORAGE,
  REFRESH_TOKEN,
} from "@/constants/local-storage";
import { UserType } from "@/lib/apis/auth-api";
import { clearAxiosConfig } from "@/utils/axios/axios-instance";
import { removeItemFromLocalStorage } from "@/utils/local-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
};

type Action = {
  setAuth: (data: State) => void;
  logOut: VoidFunction;
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (data: State) => {
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: data.isAuthenticated,
        });
      },

      logOut: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        removeItemFromLocalStorage(ACCESS_TOKEN);
        removeItemFromLocalStorage(REFRESH_TOKEN);
        clearAxiosConfig();
      },
    }),
    {
      name: AUTH_STORAGE,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
