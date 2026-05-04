import React, { useEffect, useState } from 'react'
import "./scss/newarrivals.scss"
import { useProductStore } from '../store/useProductStore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Link, useNavigate } from 'react-router-dom'

export default function NewArrivals() {
    const { NewItems, onNewMenus, onColorCode } = useProductStore();
    const navigate = useNavigate();


    useEffect(() => {
        onNewMenus();
    }, [])

    const visibleNewItems = NewItems.slice(54, 63);

    return (
        <section className='new-arrivals'>
            <div className="inner">
                <div className="new-new">
                    <div className="text-box">
                        <p className="matin-colabo">MATIN KIM X LIZ</p>
                        <h3 className="newarrivals-title">NEW <br /> ARRIVALS</h3>
                        <p className="collection-name">26 summer</p>
                        <p className="collectiontitle">'HOUSE, HAUS!'</p>
                        <pre className="collection-text">
                            미니어처와 2D, 현실 공간이 공존하는 <br />
                            세계 속에서 리즈가 상상하는 '나만의집'을 상상과<br />
                            현실의 경계 위에 그려낸다.
                        </pre>
                        <div className="button-box">
                            <Link to="/newin"> SHOP THE NEW IN</Link>
                            <img src="/" alt="" />
                        </div>
                    </div>
                    <div className="newitem-list-box">
                        <Swiper
                            modules={[Navigation, , Autoplay]}
                            slidesPerView={4}
                            spaceBetween={24}

                            loop={true}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                        >
                            {visibleNewItems.map((item, id) => (
                                <SwiperSlide key={id}>
                                    <div className="img-box" >
                                        <img onMouseEnter={(e) => (e.currentTarget.src = item.mainImg)}
                                            onMouseLeave={(e) => (e.currentTarget.src = item.hoverImg)}
                                            onClick={() => navigate(`products/${item.id}`)}
                                            src={item.hoverImg}
                                            alt={item.name} />
                                        <span className='heart'><img src="/images/heart-default.svg" alt="하트" /></span>
                                    </div>
                                    <ul className="text-box">
                                        <li id='name' onClick={() => navigate(`products/${item.id}`)}>{item.name}</li>
                                        <li id=''>
                                            {item.discountRate > 0 ? (
                                                <>
                                                    <p className="discount-rate">{item.discountRate}%</p>
                                                    <p className="discount-price">₩{item.discountPrice.toLocaleString()}</p>
                                                    <p className="original-price">₩{item.price.toLocaleString()}</p>
                                                </>
                                            ) : (
                                                <p className="price">₩{item.price.toLocaleString()}</p>
                                            )}
                                        </li>
                                        <li id='colors'>
                                            {item.colors.map((c, id) => (
                                                <span key={id} style={{ backgroundColor: onColorCode(c) }}></span>
                                            ))}
                                        </li>
                                    </ul>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}