import React from "react";
import SectionTitle from "./SectionTitle";
import "./scss/collection.scss";
import { Link } from "react-router-dom";

export default function Collection() {
  return (
    <section className="collection">
      <div className="inner2">
        <SectionTitle title="COLLECTION" subtitle="This season's favorites" />
        {/* 연결필요 */}
        <Link>
          <div className="collection-list">
            <div className="card card-1">
              <img src="./images/main-collection/collection1.jpg" alt="card1" />
            </div>
            <div className="card card-2">
              <video
                src="./videos/main-collection/collection1.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="card card-3">
              <img src="./images/main-collection/collection2.jpg" alt="card1" />
            </div>
            <div className="card card-4">
              <video
                src="./videos/main-collection/collection2.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="card card-5">
              <video
                src="./videos/main-collection/collection3.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <div className="card card-6">
              <video
                src="./videos/main-collection/collection4.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
