import React from "react";
import "./scss/mainTop.scss";

import {
  BRAND,
  useBrandStore,
} from "../store/useBrandStore";

export default function MainTop() {
  const { brand, setBrand } = useBrandStore();

  const isKimMatin =
    brand === BRAND.KIMMATIN;

  return (
    <div className="main-top">

      <div className="video-wrap">

        <video
          src={
            isKimMatin
              ? "./videos/main-top/top-video2-2160p.mp4"
              : "./videos/main-top/top-video-2160p.mp4"
          }
          autoPlay
          muted
          loop
          playsInline
        />

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