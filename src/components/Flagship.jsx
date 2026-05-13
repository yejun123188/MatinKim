import React from "react";
import SectionTitle from "./SectionTitle";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./scss/flagship.scss";

const slides = [
    { src: "./images/main-flagship/flagslider1.png", alt: "flagslider1" },
    { src: "/images/main-flagship/flagslider2.png", alt: "flagslider2" },
    { src: "/images/main-flagship/flagslider3.png", alt: "flagslider3" },
    { src: "/images/main-flagship/flagslider4.png", alt: "flagslider4" },
];

export default function Flagship() {
    return (
        <section className="flagship">
            <div className="inner">
                <SectionTitle
                    title="NEW FLAGSHIP STORE"
                    subtitle="Special promotion"
                />

                <div className="flag-wrap">

                    {/* 왼쪽 슬라이드 */}
                    <div className="banner-wrap">
                        <Swiper
                            className="mySwiper"
                            modules={[Autoplay]}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                        >
                            {slides.map((img, id) => (
                                <SwiperSlide key={id}>
                                    <img src={img.src} alt={img.alt} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* 오른쪽 프로모션 */}
                    <div className="notice-wrap">
                        <div className="text-box">

                            {/* 상단 플래그쉽 정보 */}
                            <div className="store-info">
                                <span className="label">
                                    SEOUL FLAGSHIP
                                </span>

                                <h3>
                                    MATIN KIM
                                    <br />
                                    SEONGSU
                                </h3>

                                <p>
                                    Seongsu-dong
                                    <br />
                                    11:00 - 20:00
                                </p>
                            </div>

                            {/* 하단 프로모션 영역 */}
                            <div className="bottom-content">

                                <div className="title-wrap">
                                    <h4>PROMOTION</h4>
                                </div>

                                <div className="info-group">

                                    <div className="sale">
                                        <div className="sale-content">
                                            <p className="title">
                                                세일 상품 제외 20% 할인
                                            </p>

                                            <p className="text">
                                                NON-SALE ITEMS 20% OFF (EXCLUDING SALE ITEMS)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="purchase">
                                        <div className="sale-content">
                                            <p className="title">
                                                구매 고객 전체 보난자 아메리카노 증정
                                            </p>

                                            <p className="text">
                                                FREE BONANZA AMERICANO WITH EVERY PURCHASE
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <a
                                    className="button"
                                    href="https://map.naver.com/p/entry/place/2041401276?placePath=/home"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>SEE ON MAP</span>

                                    <img
                                        src="/images/main-flagship/arrow.svg"
                                        alt="arrow"
                                    />
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}