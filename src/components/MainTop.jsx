import React from "react";
import "./scss/mainTop.scss";
import { BRAND, useBrandStore } from "../store/useBrandStore";

export default function MainTop() {
  const { brand, toggleBrand } = useBrandStore();
  const isKimMatin = brand === BRAND.KIMMATIN;

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
          <div className={`toggle-bg ${isKimMatin ? "kim-active" : ""}`}>
            <button
              type="button"
              className={`toggle-btn ${isKimMatin ? "kim-active" : ""}`}
              onClick={toggleBrand}
              aria-label="브랜드 토글"
              aria-pressed={isKimMatin}
            />
            <div className="toggle-labels" aria-hidden="true">
              <span>Matin Kim</span>
              <span>KIMMATIN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
