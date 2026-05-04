import React, { useEffect, useState } from 'react'
import SectionTitle from './SectionTitle'
import { useProductStore } from '../store/useProductStore'
import "./scss/weeklybest.scss"
import { useNavigate } from 'react-router-dom';

export default function Weeklybest() {
    const { BestItems, onBestMenus, items, onFetchItem, onColorCode } = useProductStore();
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (items.length === 0) {
            onFetchItem();
        }
        onBestMenus();
    }, [])

    //24번째부터가 여름느낌이라 24부터 함 
    const visibleItems = showAll ? BestItems.slice(24, 32) : BestItems.slice(24, 28);

    return (
        <section className='weeklybest'>
            <div className="inner">
                <SectionTitle title="WEEKLY BEST ITEM" subtitle="This season's favorites" />
                <ul className="best-item-list">
                    {visibleItems.map((item, id) => (
                        <li key={id}>
                            <div className="img-box">
                                <img onMouseEnter={(e) => e.currentTarget.src = item.hoverImg}
                                    onMouseLeave={(e) => e.currentTarget.src = item.mainImg}
                                    onClick={() => navigate(`/products/${item.id}`)}
                                    src={item.mainImg} alt={item.name} />
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
                        </li>
                    ))}
                </ul>
                <div className="see-more" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "CLOSE" : "SEE MORE"}
                </div>
            </div>
        </section>
    )
}