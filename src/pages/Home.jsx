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

export default function Home() {
  const { brand, setBrand } = useBrandStore();
  const [displayBrand, setDisplayBrand] = useState(brand);
  const [toggleBrand, setToggleBrand] = useState(brand);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const [transitionDirection, setTransitionDirection] = useState("right");
  const timersRef = useRef([]);

  const isKimMatin = displayBrand === BRAND.KIMMATIN;
  const isBrandSwitching = transitionPhase !== "idle";

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
    };
  }, []);

  const handleBrandChange = (nextBrand) => {
    if (
      isBrandSwitching ||
      nextBrand === displayBrand ||
      !Object.values(BRAND).includes(nextBrand)
    ) {
      return;
    }

    timersRef.current.forEach((timerId) =>
      window.clearTimeout(timerId)
    );
    timersRef.current = [];

    setToggleBrand(nextBrand);
    setTransitionDirection(
      nextBrand === BRAND.KIMMATIN ? "right" : "left"
    );
    setTransitionPhase("exit");

    const exitTimer = window.setTimeout(() => {
      setBrand(nextBrand);
      setDisplayBrand(nextBrand);
      setTransitionPhase("enter");
    }, EXIT_DURATION);

    const enterTimer = window.setTimeout(() => {
      setTransitionPhase("idle");
    }, EXIT_DURATION + ENTER_DURATION);

    timersRef.current = [exitTimer, enterTimer];
  };

  const homeClassName = [
    isKimMatin ? "kimmatin-home" : "",
    isBrandSwitching ? "home-brand-switching" : "",
    `home-brand-transition--${transitionDirection}`,
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
    </>
  );
}
