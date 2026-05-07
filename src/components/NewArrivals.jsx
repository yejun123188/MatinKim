import React, { useEffect } from 'react'
import "./scss/newarrivals.scss"
import { useProductStore } from '../store/useProductStore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'

export default function NewArrivals() {
    const { NewItems, onNewMenus, items, onFetchItem } = useProductStore();


    useEffect(() => {
        if (items.length === 0) {
            onFetchItem();
        }
        onNewMenus();
    }, [items.length, onFetchItem, onNewMenus])

    const visibleNewItems = NewItems.slice(54, 66);

    return (
        <section className='new-arrivals'>
            <div className="inner">
                <div className="new-new">
                    <div className="text-box">
                        <p className="matin-colabo">MATIN KIM X LIZ</p>
                        <h3 className="newarrivals-title">NEW <br /> ARRIVALS</h3>
                        <hr />
                        <p className="collection-name">26 summer</p>
                        <p className="collection-title">'HOUSE, HAUS!'</p>
                        <p className="collection-text">
                            미니어처와 2D, 현실 공간이 공존하는
                            세계 속에서 리즈가 상상하는 '나만의집'을 상상과
                            현실의 경계 위에 그려낸다.
                        </p>
                        <div className="button-box">
                            <Link to="/newin">SHOP THE NEW IN</Link>
                        </div>
                    </div>
                    <div className="newitem-list-box">
                        <Swiper
                            modules={[Navigation, Autoplay, Pagination]}
                            slidesPerView={5}
                            spaceBetween={24}
                            // navigation={true}
                            loop={true}
                            pagination={{
                                type: 'progressbar',
                            }}
                            speed={700}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                        >
                            {visibleNewItems.map((item, id) => (
                                <SwiperSlide key={id}>
                                    <ProductCard cate={item} as="article" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}
