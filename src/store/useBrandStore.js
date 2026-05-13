import { create } from "zustand";

export const BRAND = {
  MATINKIM: "MATINKIM",
  KIMMATIN: "KIMMATIN",
};

export const useBrandStore = create((set) => ({
  brand: BRAND.MATINKIM,
  toggleBrand: () =>
    set((state) => ({
      brand:
        state.brand === BRAND.MATINKIM ? BRAND.KIMMATIN : BRAND.MATINKIM,
    })),
}));
