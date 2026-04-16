import React from 'react'

import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css";
import "./scss/flagship.scss";

export default function SubSwiper({ slides }) {
    return (
        <div className='inner'>
            <Swiper className='mySwiper'
                modules={[Autoplay]}
                autoplay={{
                    delay: 2700,
                }}
                loop={true}>
                {slides.map((img, id) => (
                    <SwiperSlide key={id}><img src={img.src} alt={img.text} />
                        <div className="main-text">
                            <h3> {img.title}</h3>
                            <h4>{img.subtitle}</h4>
                            <p>{img.text}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    )
}
