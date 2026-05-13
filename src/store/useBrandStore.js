import { create } from "zustand";

export const BRAND = {
  MATINKIM: "MATINKIM",
  KIMMATIN: "KIMMATIN",
};

const BRAND_STORAGE_KEY = "matin-kim-brand";

const getInitialBrand = () => {
  if (typeof window === "undefined") return BRAND.MATINKIM;

  const savedBrand = window.localStorage.getItem(BRAND_STORAGE_KEY);
  return Object.values(BRAND).includes(savedBrand) ? savedBrand : BRAND.MATINKIM;
};

export const useBrandStore = create((set) => ({
  brand: getInitialBrand(),
  setBrand: (brand) =>
    set(() => {
      if (!Object.values(BRAND).includes(brand)) return {};

      window.localStorage.setItem(BRAND_STORAGE_KEY, brand);

      return { brand };
    }),
  toggleBrand: () =>
    set((state) => {
      const brand =
        state.brand === BRAND.MATINKIM ? BRAND.KIMMATIN : BRAND.MATINKIM;

      window.localStorage.setItem(BRAND_STORAGE_KEY, brand);

      return { brand };
    }),
}));
