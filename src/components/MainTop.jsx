import React from "react";
import "./scss/mainTop.scss";

export default function MainTop() {
  return (
    <div className="main-top">
      <div className="video-wrap">
        <video
          src="./videos/main-top/top-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className="toggle-wrap">
        <div className="toggle-wrap-radi">
          <div className="toggle-bg">
            <span>Matin Kim</span>
            <span>KIMMATIN</span>
            <button className="toggle-btn">
              <span className="text1">Matin Kim</span>
              <span className="text2 active">KIMMATIN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
