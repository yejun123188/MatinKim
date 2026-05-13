import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import "./scss/mainTop.scss";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  BRAND,
  useBrandStore,
} from "../store/useBrandStore";

const kimMatinHeroImages = [
  "/images/KIMMATIN-hero/KM_main_slider_01.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_02.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_03.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_04.jpg",
  "/images/KIMMATIN-hero/KM_main_slider_05.jpg",
];

export default function MainTop({
  brandOverride,
  toggleBrandOverride,
  isBrandSwitching = false,
  mediaClassName = "",
  onBrandChange,
} = {}) {
  const { brand, setBrand } = useBrandStore();
  const preloadVideoRef = useRef(null);
  const [matinVideoPoster, setMatinVideoPoster] = useState("");
  const [isMatinVideoReady, setIsMatinVideoReady] = useState(false);
  const [showMatinToggleOverlay, setShowMatinToggleOverlay] = useState(false);
  const toggleOverlayTimerRef = useRef(null);
  const activeBrand = brandOverride || brand;
  const activeToggleBrand = toggleBrandOverride || activeBrand;
  const changeBrand = onBrandChange || setBrand;

  const isKimMatin =
    activeBrand === BRAND.KIMMATIN;
  const isToggleKimMatin =
    activeToggleBrand === BRAND.KIMMATIN;

  useEffect(() => {
    if (!isKimMatin) {
      setIsMatinVideoReady(false);
    }
  }, [isKimMatin]);

  useEffect(() => {
    if (isBrandSwitching && activeToggleBrand === BRAND.MATINKIM) {
      if (toggleOverlayTimerRef.current) {
        window.clearTimeout(toggleOverlayTimerRef.current);
      }
      setShowMatinToggleOverlay(true);
      return undefined;
    }

    if (!isBrandSwitching && showMatinToggleOverlay) {
      toggleOverlayTimerRef.current = window.setTimeout(() => {
        setShowMatinToggleOverlay(false);
      }, 520);
    }

    return undefined;
  }, [activeToggleBrand, isBrandSwitching, showMatinToggleOverlay]);

  useEffect(() => {
    return () => {
      if (toggleOverlayTimerRef.current) {
        window.clearTimeout(toggleOverlayTimerRef.current);
      }
    };
  }, []);

  const captureMatinVideoPoster = () => {
    const video = preloadVideoRef.current;

    if (!video || matinVideoPoster || !video.videoWidth || !video.videoHeight) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setMatinVideoPoster(canvas.toDataURL("image/jpeg", 0.86));
    } catch {
      setMatinVideoPoster("");
    }
  };

  return (
    <div className="main-top">
      <video
        ref={preloadVideoRef}
        className="main-top-video-preload"
        src="./videos/main-top/top-video-2160p.mp4"
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
        onLoadedData={captureMatinVideoPoster}
      />

      <div
        className={[
          "video-wrap",
          mediaClassName,
          !isKimMatin && "matinkim-video-wrap",
          !isKimMatin && matinVideoPoster && "has-video-poster",
          !isKimMatin &&
            (isMatinVideoReady ? "is-video-ready" : "is-video-loading"),
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          !isKimMatin && matinVideoPoster
            ? { backgroundImage: `url(${matinVideoPoster})` }
            : undefined
        }
      >
        {isKimMatin ? (
          <Swiper
            className="kimmatin-hero-swiper"
            modules={[Autoplay]}
            slidesPerView={1}
            loop
            speed={900}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
            }}
          >
            {kimMatinHeroImages.map((src) => (
              <SwiperSlide key={src}>
                <img src={src} alt="" aria-hidden="true" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <video
            src="./videos/main-top/top-video-2160p.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={matinVideoPoster || undefined}
            onLoadedData={() => setIsMatinVideoReady(true)}
            onCanPlay={() => setIsMatinVideoReady(true)}
          />
        )}

      </div>

      <div
        className={`toggle-wrap ${showMatinToggleOverlay ? "show-matinkim-overlay" : ""
          }`}
      >

        <div className="toggle-wrap-radi">

          <div
            className={`toggle-bg ${isToggleKimMatin ? "kim-active" : ""
              }`}
          >

            {/* 슬라이드 버튼 */}
            <div
              className={`toggle-btn ${isToggleKimMatin ? "kim-active" : ""
                }`}
            />

            {/* 브랜드 버튼 */}
            <div className="toggle-labels">

              <button
                type="button"
                className={
                  !isToggleKimMatin ? "active" : ""
                }
                disabled={isBrandSwitching}
                onClick={() =>
                  changeBrand(BRAND.MATINKIM)
                }
              >
                Matin Kim
              </button>

              <button
                type="button"
                className={
                  isToggleKimMatin ? "active" : ""
                }
                disabled={isBrandSwitching}
                onClick={() =>
                  changeBrand(BRAND.KIMMATIN)
                }
              >
                KIMMATIN
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
