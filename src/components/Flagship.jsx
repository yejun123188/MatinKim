import React from 'react'
import SectionTitle from './SectionTitle'


import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css";
import "./scss/falgship.scss";

const slides = [
    { src: "./images/main-flagship/flagslider1.png", alt: "flagslider1" },
    { src: "/images/main-flagship/flagslider2.png", alt: "flagslider2" },
    { src: "/images/main-flagship/flagslider3.png", alt: "flagslider3" },
    { src: "/images/main-flagship/flagslider4.png", alt: "flagslider4" },
]

export default function Flagship() {
    return (
        <section>
            <div className='inner'>
                <SectionTitle title="NEW FLAGSHIP STORE" subtitle="Special promotion" />
                <div className="flag-wrap">
                    <div className="banner-wrap">

                        <Swiper className='mySwiper'
                            modules={[Autoplay]}
                            autoplay={{
                                delay: 2500,
                            }}
                            loop={true}>
                            {slides.map((img, id) => (
                                <SwiperSlide key={id}><img src={img.src} alt={img.alt} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className='notice-wrap'>
                        <img src="./images/main-flagship/flagshipbg.png" alt="" />
                        <div className="text-box">
                            <div className="title">
                                <h4>SPECIAL</h4>
                                <h4>PROMOTION</h4>
                            </div>
                            <div className="sale">
                                <p className="per">20%</p>
                                <div className="sale-content">
                                    <p className='title'>세일 상품 제외 20%할인</p>
                                    <p className='text'>
                                        Non-sale Items 20% OFF <br />
                                        (Excludeing Sale Items)
                                    </p>
                                </div>
                            </div>
                            <div className="puchase">
                                <p className="coffee"><img src="" alt="커피" /></p>
                                <div className="sale-content">
                                    <p className='title'>
                                        구매 고객 전체<br />
                                        보난자 아메리카노 증정
                                    </p>
                                    <p className='text'>
                                        FREE BONANZA AMERICANO<br />
                                        With Every Purchase
                                    </p>
                                </div>
                            </div>
                            <div className="button">
                                <a href="#"> SEE ON MAP</a>
                                <i>화살표</i>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
