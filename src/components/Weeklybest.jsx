import React, { useEffect, useState } from 'react'
import SectionTitle from './SectionTitle'
import { useProductStore } from '../store/useProductStore'
import "./scss/weeklybest.scss"

export default function Weeklybest() {
    const { BestItems, onBestMenus, items, onFetchItem } = useProductStore();
    const [showAll, setShowAll] = useState(false);

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
                        // 클릭하면 제품 상세페이지로 이동하는거 아직안함 상세페이지 만들면 연결예정!~!!~!
                        //마우스 호버하면 이미지 어케 변할지도 정해야함
                        //하트 이미지도 넣어야함
                        <li key={id}>
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