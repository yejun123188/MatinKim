import { create } from "zustand";

export const useLoginStore = create((set) => ({
    isLoginOpen: false,
    guestMode: false,
    guestOrderItems: [],
    openLogin: (guestOrderItems = []) => set({
        isLoginOpen: true,
        guestMode: guestOrderItems.length > 0,
        guestOrderItems,
    }),
    closeLogin: () => set({
        isLoginOpen: false,
        guestMode: false,
        guestOrderItems: [],
    }),
}));