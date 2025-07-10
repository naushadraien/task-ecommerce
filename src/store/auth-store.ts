import { AUTH_STORAGE } from "@/constants/local-storage";
import { User } from "@/types/types";
import { getItemFromLocalStorage } from "@/utils/local-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

type Action = {
  setAuth: (data: State) => void;
  logOut: VoidFunction;
  clearStorage: VoidFunction;
  initializeAuth: (fallbackData?: State) => void;
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set, get, api) => ({
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
      initializeAuth: (fallbackData?: State) => {
        const authStorageData = getItemFromLocalStorage<State>(AUTH_STORAGE);
        if (authStorageData) {
          set({
            user: authStorageData.user,
            token: authStorageData.token,
            isAuthenticated: authStorageData.isAuthenticated,
          });
        }

        if (fallbackData) {
          set({
            user: fallbackData.user,
            token: fallbackData.token,
            isAuthenticated: fallbackData.isAuthenticated,
          });
        }
      },

      logOut: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearStorage: () => {
        api.persist.clearStorage();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
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
