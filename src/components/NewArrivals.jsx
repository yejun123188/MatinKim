import React, { useEffect, useRef } from 'react'
import "./scss/newarrivals.scss"
import { useProductStore } from '../store/useProductStore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from './ProductCard'
import SectionTitle from './SectionTitle'

export default function NewArrivals() {
    const slideWrapRef = useRef(null);
    const progressFillRef = useRef(null);
    const shiftRef = useRef(0);

    const { NewItems, onNewMenus, items, onFetchItem } = useProductStore();

    useEffect(() => {
        if (items.length === 0) onFetchItem();
        onNewMenus();
    }, [items.length, onFetchItem, onNewMenus]);

    const visibleNewItems = NewItems.slice(54, 66).filter(
        (item) =>
            !(
                Array.isArray(item.soldout) &&
                item.soldout.length > 0 &&
                item.soldout.every(Boolean)
            )
    );
    const TOTAL = visibleNewItems.length;

    // 왼쪽 여백 계산
    const getSideSpace = () => {
        return (window.innerWidth - Math.min(window.innerWidth, 1440)) / 2;
    };

    const handleSlideChange = (swiper) => {
        const maxShift = 140;
        const movePerSlide = 0;

        shiftRef.current = Math.min(
            swiper.realIndex * movePerSlide,
            maxShift
        );

        if (slideWrapRef.current) {
            slideWrapRef.current.style.transition =
                'transform 0.6s ease-out';

            slideWrapRef.current.style.transform =
                `translateX(-${shiftRef.current}px)`;
        }

        if (progressFillRef.current) {
            const progress = (swiper.realIndex + 1) / TOTAL;

            progressFillRef.current.style.transition =
                'width 0.6s ease-out';

            progressFillRef.current.style.width =
                `${progress * 100}%`;
        }
    };

    return (
        <section className="new-arrivals">
            <div className="inner">
                <SectionTitle
                    title="NEW ARRIVALS"
                    subtitle="이번 시즌 새롭게 도착한 아이템"
                />
            </div>

            <div className="slide-outer">
                <div className="slide-wrap" ref={slideWrapRef}>
                    {visibleNewItems.length > 0 && (
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            slidesPerView="auto"
                            spaceBetween={24}
                            loop={visibleNewItems.length > 6}
                            speed={700}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            onSlideChangeTransitionStart={handleSlideChange}
                        >
                            {visibleNewItems.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <ProductCard cate={item} as="article" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="progress-bar-wrap">
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            ref={progressFillRef}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
