import React, { useEffect, useState } from 'react'
import "./scss/shortcut.scss"
import { shortCutData } from '../data/shortCut'
import SectionTitle from './SectionTitle'
import { Link } from 'react-router-dom'

export default function ShortCut() {
    const [shortCut, setShortCut] = useState([]);
    useEffect(() => {
        setShortCut(shortCutData.map(item => item.id === 1 ? { ...item, active: true } : item))
    }, [])

    // 마우스 호버
    const handleOver = (id) => {
        setShortCut((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, active: true } : { ...item, active: false }))
    }

    // 마우스 아웃
    const handleOut = (id) => {
        setShortCut((prev) =>
            prev.map((item) =>
                item.id === 1 ? { ...item, active: true } : { ...item, active: false }))
    }

    // console.log("마우스", shortCut)

    return (
        <section>
            <div className="inner">
                <SectionTitle title="SHORTCUT" subtitle="Start with a Tap" />
                <ul className='shortcut-list'>
                    {shortCut.map((short, id) =>
                        <li key={id}
                            className={short.active ? "active" : ""}
                            onMouseEnter={() => handleOver(short.id)}
                            onMouseLeave={() => handleOut(short.id)}
                        >
                            <Link to={`/${short.linkUrl}`}>
                                <div className="img-box">
                                    <img src={short.imgUrl} alt="" />
                                </div>
                                <div className="text-box">
                                    <div className='text-top'>
                                        <span>MATIN KIM</span>
                                        <h3>{short.title}</h3>
                                    </div>
                                    <div className='text-bottom'>
                                        <p className='text-des'>{short.des}</p>
                                        <p className='text-more'>
                                            <img src="/images/shortcut/more.png" alt="" />
                                            <span>MORE</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </section>
    )
}
