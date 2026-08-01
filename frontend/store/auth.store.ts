import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  setAuth: (accessToken: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setAuth: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "travel-planner-auth",
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
