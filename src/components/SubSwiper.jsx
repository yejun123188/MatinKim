import React from 'react'

import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css";

export default function SubSwiper({ slides }) {
    return (
        <div className='inner'>
            <Swiper className='mySub-Swiper'
                modules={[Autoplay]}
                autoplay={{
                    delay: 2700,
                }}
                loop={true}>
                {slides.map((img, id) => (
                    <SwiperSlide key={id}>
                        <div className="show-slide">
                            <img src={img.src} alt={img.text} />
                            <div className="main-text">
                                <h3> {img.title}</h3>
                                <h4>{img.subtitle}</h4>
                                <p>{img.text}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    )
}
