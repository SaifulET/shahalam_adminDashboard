import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  email: '',
  
  // Actions
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),

  login: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),
}));
