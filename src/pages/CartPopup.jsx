import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "./scss/CartPopop.scss"
import { useProductStore } from '../store/useProductStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CartPopup({ product, selectedColor, selectedSize, quantity, onClose, onGoCart, mode = "wish" }) {
    const navigate = useNavigate();
    const { wishList, BestItems, onBestMenus } = useProductStore();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const price = product?.discountRate > 0 ? product?.discountPrice : product?.price;
    const totalPrice = (price * quantity).toLocaleString();

    // mode가 best면 베스트 아이템 로드
    useEffect(() => {
        if (mode === "best") onBestMenus();
    }, [mode]);

    // mode에 따라 리스트와 타이틀 결정
    const recommendList = mode === "wish" ? wishList : BestItems;
    const recommendTitle = mode === "wish" ? "MY WISHLIST" : "BEST ITEM";

    return (
        <div className='modal-overlay cart-popup' onClick={onClose}>
            <div className='modal-wrap' onClick={(e) => e.stopPropagation()}>

                {recommendList.length > 0 && (
                    <>
                        <button ref={prevRef} className="wish-nav wish-nav-prev">‹</button>
                        <button ref={nextRef} className="wish-nav wish-nav-next">›</button>
                    </>
                )}

                <div className="wish-top">
                    <p className='modal-added-msg'>장바구니에 상품을 담았습니다</p>
                    <button className='modal-close-btn' onClick={onClose}>×</button>
                </div>

                <div className="cart-go">
                    <div className="cart-go-img">
                        <img src={product?.mainImg || product?.hoverImg} alt={product?.name} />
                    </div>
                    <div className="cart-go-text">
                        <p className='cart-popup-name'>{product?.name}</p>
                        <p className='cart-popup-option'>{selectedColor} / {selectedSize} / {quantity}개</p>
                        <p className='cart-popup-price'>{totalPrice}원</p>
                    </div>
                </div>

                <div className="cart-recommand">
                    <div className="wish-title-row">
                        <p className="wish-title">{recommendTitle}</p>
                        {/* wish 모드일 때만 전체보기 버튼 표시 */}
                        {mode === "wish" && recommendList.length > 0 && (
                            <button
                                className="wish-more-btn"
                                onClick={() => { onClose(); navigate('/userinfo', { state: { menu: '위시리스트' } }); }}
                            >
                                전체보기 →
                            </button>
                        )}
                    </div>

                    {recommendList.length === 0 ? (
                        <p className="wish-empty">
                            {mode === "wish" ? "찜한 상품이 없습니다" : "베스트 상품이 없습니다"}
                        </p>
                    ) : (
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            spaceBetween={10}
                            slidesPerView={3.5}
                            className="wish-swiper"
                        >
                            {recommendList.map((item) => (
                                <SwiperSlide key={item.key || item.id}>
                                    <div
                                        className="wish-item"
                                        onClick={() => { onClose(); navigate(`/products/${item.id}`); }}
                                    >
                                        <div className="wish-item-img">
                                            <img src={item.mainImg} alt={item.name} />
                                        </div>
                                        <div className="wish-item-info">
                                            <p className="wish-item-name">{item.name}</p>
                                            {mode === "wish" && (
                                                <p className="wish-item-option">
                                                    {item.selectedColor} / {item.selectedSize}
                                                </p>
                                            )}
                                            <p className="wish-item-price">
                                                {item.discountRate > 0
                                                    ? item.discountPrice?.toLocaleString()
                                                    : item.price?.toLocaleString()}원
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="cart-popup-buttons">
                    <button className='btn-continue' onClick={onClose}>쇼핑 계속하기</button>
                    <button className='btn-go-cart' onClick={onGoCart}>장바구니 보기</button>
                </div>
            </div>
        </div>
    );
}