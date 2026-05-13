import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import Instagram from "../components/Instagram";
import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";
import Weeklybest from "../components/Weeklybest";
import NewArrivals from "../components/NewArrivals";
import MainTop from "../components/MainTop";
import Collection from "../components/Collection";
import ShortCut from "../components/ShortCut";
import TimeSalePopup from "../components/TimeSalePopup";
import MiddleBanner from "../components/MiddleBanner";
import { BRAND, useBrandStore } from "../store/useBrandStore";
import "./scss/Home.scss";

const EXIT_DURATION = 420;
const ENTER_DURATION = 640;
const BACKGROUND_LEAD_DURATION = 160;
const BRAND_READY_DELAY = 420;

const kimMatinPreloadImages = [
  "/images/KIMMATIN-hero/KM_main_slider_01.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_02.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_03.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_04.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_05.jpg",
  "/images/header/logo-KIMMATIN-white.svg",
];

const matinKimPreloadImages = [
  "/images/header/logo-MatinKim-black.svg",
];

const preloadImages = (sources) => {
  if (typeof window === "undefined") return;

  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
  });
};

export default function Home() {
  const { brand, setBrand } = useBrandStore();
  const [displayBrand, setDisplayBrand] = useState(brand);
  const [toggleBrand, setToggleBrand] = useState(brand);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const [transitionDirection, setTransitionDirection] = useState("right");
  const timersRef = useRef([]);
  const scrollPendingRef = useRef(false);

  const isKimMatin = displayBrand === BRAND.KIMMATIN;
  const isBrandSwitching = transitionPhase !== "idle";
  const backgroundBrand = isBrandSwitching ? toggleBrand : displayBrand;

  useEffect(() => {
    if (!isBrandSwitching && brand !== displayBrand) {
      setDisplayBrand(brand);
      setToggleBrand(brand);
    }
  }, [brand, displayBrand, isBrandSwitching]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) =>
        window.clearTimeout(timerId)
      );
      scrollPendingRef.current = false;
    };
  }, []);

  const handleBrandChange = (nextBrand) => {
    if (
      isBrandSwitching ||
      scrollPendingRef.current ||
      nextBrand === displayBrand ||
      !Object.values(BRAND).includes(nextBrand)
    ) {
      return;
    }

    timersRef.current.forEach((timerId) =>
      window.clearTimeout(timerId)
    );
    timersRef.current = [];

    const startTransition = () => {
      setToggleBrand(nextBrand);
      if (nextBrand === BRAND.KIMMATIN) {
        preloadImages(kimMatinPreloadImages);
      } else {
        preloadImages(matinKimPreloadImages);
      }

      setTransitionDirection(
        nextBrand === BRAND.KIMMATIN ? "right" : "left"
      );
      setTransitionPhase("prepare");

      const prepareTimer = window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("matinKimBrandTransition", {
            detail: { phase: "exit", nextBrand },
          })
        );
        setTransitionPhase("exit");
      }, BACKGROUND_LEAD_DURATION);

      const exitTimer = window.setTimeout(() => {
        setBrand(nextBrand);
        setDisplayBrand(nextBrand);
        window.dispatchEvent(
          new CustomEvent("matinKimBrandTransition", {
            detail: { phase: "enter", nextBrand },
          })
        );
        setTransitionPhase("enter");
      }, BACKGROUND_LEAD_DURATION + EXIT_DURATION + BRAND_READY_DELAY);

      const enterTimer = window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("matinKimBrandTransition", {
            detail: { phase: "idle", nextBrand },
          })
        );
        setTransitionPhase("idle");
      }, BACKGROUND_LEAD_DURATION + EXIT_DURATION + BRAND_READY_DELAY + ENTER_DURATION);

      timersRef.current = [prepareTimer, exitTimer, enterTimer];
    };

    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollTop > 8) {
      scrollPendingRef.current = true;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      const scrollDelay = Math.min(760, Math.max(360, scrollTop * 0.28));
      const scrollTimer = window.setTimeout(() => {
        scrollPendingRef.current = false;
        startTransition();
      }, scrollDelay);

      timersRef.current = [scrollTimer];
      return;
    }

    startTransition();
  };

  const homeClassName = [
    isKimMatin ? "kimmatin-home" : "",
    backgroundBrand === BRAND.KIMMATIN
      ? "home-brand-bg--kimmatin"
      : "home-brand-bg--matinkim",
    isBrandSwitching ? "home-brand-switching" : "",
    `home-brand-transition--${transitionDirection}`,
    isBrandSwitching ? `is-${transitionPhase}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClassName = [
    "brand-transition-overlay",
    backgroundBrand === BRAND.KIMMATIN
      ? "brand-transition-overlay--kimmatin"
      : "brand-transition-overlay--matinkim",
    isBrandSwitching ? "is-active" : "",
    isBrandSwitching ? `is-${transitionPhase}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {!isKimMatin && <TimeSalePopup />}

      <main className={homeClassName}>
        <MainTop
          brandOverride={displayBrand}
          toggleBrandOverride={toggleBrand}
          isBrandSwitching={isBrandSwitching}
          mediaClassName="home-brand-animate-item"
          onBrandChange={handleBrandChange}
        />
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <ShortCut />
          </div>
        )}
        <div className="home-brand-animate-item">
          <Weeklybest />
        </div>
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <MiddleBanner />
          </div>
        )}
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <NewArrivals />
          </div>
        )}
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <TheEdit />
          </div>
        )}
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <Flagship />
          </div>
        )}
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <Collection />
          </div>
        )}
        {!isKimMatin && (
          <div className="home-brand-animate-item">
            <Instagram />
          </div>
        )}
      </main>
      <div className={overlayClassName} aria-hidden="true">
        <img
          src={
            backgroundBrand === BRAND.KIMMATIN
              ? "/images/header/logo-KIMMATIN-white.svg"
              : "/images/header/logo-MatinKim-black.svg"
          }
          alt=""
        />
      </div>
    </>
  );
}
