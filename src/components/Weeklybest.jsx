import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SectionTitle from './SectionTitle'
import { useProductStore } from '../store/useProductStore'
import "./scss/weeklybest.scss"
import ProductCard from './ProductCard';

export default function Weeklybest() {
    const { BestItems, onBestMenus, items, onFetchItem } = useProductStore();
    const [showAll, setShowAll] = useState(false);
    const [listHeight, setListHeight] = useState(0);
    const listRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // 한 번만 실행
                }
            },
            {
                threshold: 0.2, // 섹션 20% 보이면 실행
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (items.length === 0) {
            onFetchItem();
        }
        onBestMenus();
    }, [])

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return undefined;

        const updateListHeight = () => {
            const firstCard = list.querySelector('.product-card');
            if (!firstCard) return;

            setListHeight(showAll ? list.scrollHeight : firstCard.offsetHeight);
        };

        updateListHeight();
        window.addEventListener('resize', updateListHeight);

        return () => window.removeEventListener('resize', updateListHeight);
    }, [BestItems.length, showAll]);

    //24번째부터가 여름느낌이라 24부터 함 
    const visibleItems = BestItems.slice(24, 34);

    return (
        <section
            ref={sectionRef}
            className={`weeklybest ${isVisible ? 'is-visible' : ''}`}
        >
            <div className="inner">
                <SectionTitle title="WEEKLY BEST ITEM" subtitle="이번 시즌의 인기 아이템" />
                <div
                    className={`best-item-list-wrap ${showAll ? 'is-open is-animate' : ''}`}
                    style={{ maxHeight: listHeight ? `${listHeight}px` : undefined }}
                >
                    <ul className="best-item-list" ref={listRef}>
                        {visibleItems.map((item, id) => (
                            <ProductCard cate={item} key={id} />
                        ))}
                    </ul>
                </div>
                <button type="button" className="see-more" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "CLOSE" : "SEE MORE"}
                    <img
                        src={`/images/pages-icon/${showAll ? 'top-icon.svg' : 'bottom-icon.svg'}`}
                        alt=""
                        aria-hidden="true"
                    />
                </button>
            </div>
        </section>
    )
}
