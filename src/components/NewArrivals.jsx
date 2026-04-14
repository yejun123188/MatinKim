import React, { useEffect } from 'react'
import "./scss/newarrivals.scss"
import { useProductStore } from '../store/useProductStore'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

export default function NewArrivals() {
    const { NewItems, onNewMenus } = useProductStore();

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
                        <p className="collection title">'HOUSE, HAUS!'</p>
                        <pre className="collection-text">
                            미니어처와 2D, 현실 공간이 공존하는 <br />
                            '세계 속에서<br />
                            리즈가 상상하는 '나만의집'을 상상과<br />
                            현실의 경계 위에 그려낸다.
                        </pre>
                        <div className="button-box">
                            SHOP THE NEW IN
                        </div>
                    </div>
                    <div className="newitem-list-box">
                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={3}
                            spaceBetween={24}
                            navigation
                        >
                            {visibleNewItems.map((item, id) => (
                                <SwiperSlide key={id}>
                                    <div className="img-box">
                                        <img src={item.mainImg} alt={item.name} />
                                        <span className='heart'><img src="/" alt="하트 들어갈자리" /></span>
                                    </div>
                                    <ul className="text-box">
                                        <li id='name'>{item.name}</li>
                                        <li id='price'>₩ {item.price}</li>
                                        <li id='colors'>
                                            {item.colors.map((c, id) => (
                                                <span key={id} style={{ backgroundColor: c }}>색상</span>
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