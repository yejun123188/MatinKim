import React from "react";
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
  const activeBrand = brandOverride || brand;
  const activeToggleBrand = toggleBrandOverride || activeBrand;
  const changeBrand = onBrandChange || setBrand;

  const isKimMatin =
    activeBrand === BRAND.KIMMATIN;
  const isToggleKimMatin =
    activeToggleBrand === BRAND.KIMMATIN;

  return (
    <div className="main-top">
      <video
        className="main-top-video-preload"
        src="./videos/main-top/top-video-2160p.mp4"
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
      />

      <div
        className={["video-wrap", mediaClassName]
          .filter(Boolean)
          .join(" ")}
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
          />
        )}

      </div>

      <div className="toggle-wrap">

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
