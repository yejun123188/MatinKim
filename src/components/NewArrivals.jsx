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

    const visibleNewItems = NewItems.slice(54, 66);
    const TOTAL = visibleNewItems.length;

    // weeklybest grid 시작점과 동일
    const getSideSpace = () => (window.innerWidth - Math.min(window.innerWidth, 1440)) / 2;
    const getCardWidth = () => (Math.min(window.innerWidth, 1440) - 96) / 5;

    const handleSlideChange = (swiper) => {
        if (slideWrapRef.current) {
            const sideSpace = getSideSpace();
            const cardWidth = getCardWidth();

            if (shiftRef.current < sideSpace) {
                shiftRef.current = Math.min(shiftRef.current + cardWidth, sideSpace);
                slideWrapRef.current.style.transition =
                    'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                slideWrapRef.current.style.marginLeft =
                    `${getSideSpace() - shiftRef.current}px`;
            }
        }

        if (progressFillRef.current) {
            const progress = (swiper.realIndex + 1) / TOTAL;
            progressFillRef.current.style.transition =
                'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            progressFillRef.current.style.width = `${progress * 100}%`;
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
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        slidesPerView="auto"
                        spaceBetween={24}
                        loop={true}
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
                </div>

                <div className="progress-bar-wrap">
                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" ref={progressFillRef}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}