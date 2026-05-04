import React, { useEffect, useMemo } from 'react'
import SectionTitle from './SectionTitle'
import { Link } from 'react-router-dom'
import "./scss/theedit.scss"
import { useProductStore } from '../store/useProductStore'

const EDIT_CONFIG = [
    {
        src: "./images/main-theedit/edit1.png",
        alt: "edit1",
        title: "Matin Kim X Nct jeno",
        subscribe: "'No Rush!'",
        link: "",
        subIds: ["5514", "9008"],
        useHover: false,
    },
    {
        src: "./images/main-theedit/edit2.png",
        alt: "edit2",
        title: "Matin kim x Liz",
        subscribe: "'BUCKET LIST'",
        link: "",
        subIds: ["8721", "8951"],
        useHover: true,  // ← 이것만 hoverImg 사용
    },
    {
        src: "./images/main-theedit/edit3.png",
        alt: "edit3",
        title: "Matin kim x Ningning",
        subscribe: "'Record 2'",
        link: "",
        subIds: ["8367", "8344"],
        useHover: false,
    },
]

export default function TheEdit() {
    const { items, onFetchItem, onColorCode } = useProductStore();

    useEffect(() => {
        if (items.length === 0) onFetchItem();
    }, [items.length, onFetchItem]);

    const edits = useMemo(() => {
        return EDIT_CONFIG.map((edit) => ({
            ...edit,
            sub: edit.subIds
                .map((id) => items.find((item) => item.id === id))
                .filter(Boolean),
        }));
    }, [items]);

    return (
        <section className="the-edit-section">
            <div className="inner">
                <SectionTitle title="THE EDIT" subtitle="Chosen by jeno, liz, ningning" />
                <div className='edit-wrap'>
                    {edits.map((e, idx) => (
                        <div className="edit-list" key={idx}>
                            <div className="top">
                                <Link to={e.link}>
                                    <div className="img-box">
                                        <img src={e.src} alt={e.alt} />
                                    </div>
                                    <div className="text-box">
                                        <h4>{e.title}</h4>
                                        <p>{e.subscribe}</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bottom">
                                {e.sub.map((s) => {
                                    // useHover가 true면 hoverImg, 없으면 mainImg fallback
                                    const thumbnail = e.useHover
                                        ? (s.hoverImg || s.mainImg)
                                        : (s.mainImg || s.hoverImg);

                                    return (
                                        <div className='bottom-edit-list' key={s.id}>
                                            <Link to={`/products/${s.id}`}>
                                                <div className="img-box">
                                                    <img src={thumbnail} alt={s.name} />
                                                </div>
                                                <ul className="text-box">
                                                    <li>{s.name}</li>
                                                    <li>
                                                        {s.discountRate > 0 ? (
                                                            <>
                                                                <p className="discount-rate">{s.discountRate}%</p>
                                                                <p className="discount-price">₩{s.discountPrice.toLocaleString()}</p>
                                                                <p className="original-price">₩{s.price.toLocaleString()}</p>
                                                            </>
                                                        ) : (
                                                            <p className="price">₩{s.price.toLocaleString()}</p>
                                                        )}
                                                    </li>
                                                    <li className="color-list">
                                                        {(s.colors || []).map((c, cIdx) => (
                                                            <span
                                                                key={cIdx}
                                                                style={{ backgroundColor: onColorCode(c) }}
                                                            />
                                                        ))}
                                                    </li>
                                                </ul>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}