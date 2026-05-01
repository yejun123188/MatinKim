import { create } from "zustand";

export const useLoginStore = create((set) => ({
    isLoginOpen: false,
    openLogin: () => set({ isLoginOpen: true }),
    closeLogin: () => set({ isLoginOpen: false }),
}));