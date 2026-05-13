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

export default function MainTop() {
  const { brand, setBrand } = useBrandStore();

  const isKimMatin =
    brand === BRAND.KIMMATIN;

  return (
    <div className="main-top">

      <div className="video-wrap">
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
          />
        )}

      </div>

      <div className="toggle-wrap">

        <div className="toggle-wrap-radi">

          <div
            className={`toggle-bg ${isKimMatin ? "kim-active" : ""
              }`}
          >

            {/* 슬라이드 버튼 */}
            <div
              className={`toggle-btn ${isKimMatin ? "kim-active" : ""
                }`}
            />

            {/* 브랜드 버튼 */}
            <div className="toggle-labels">

              <button
                type="button"
                className={
                  !isKimMatin ? "active" : ""
                }
                onClick={() =>
                  setBrand(BRAND.MATINKIM)
                }
              >
                Matin Kim
              </button>

              <button
                type="button"
                className={
                  isKimMatin ? "active" : ""
                }
                onClick={() =>
                  setBrand(BRAND.KIMMATIN)
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
