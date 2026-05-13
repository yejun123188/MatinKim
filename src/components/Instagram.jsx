import React, { useEffect, useState } from 'react'
import { instaData } from '../data/instaData'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import "./scss/instagram.scss"

export default function Instagram() {
    const [insta, setInsta] = useState([])

    const shuffleArray = (array) => {
        const arr = [...array]

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }

        return arr
    }

    useEffect(() => {
        const randomFive = shuffleArray(instaData).slice(0, 5)
        setInsta(randomFive)
    }, [])

    // 하트 클릭
    // const handleHeart = (id) => {
    //     setInsta((prev) =>
    //         prev.map((item) =>
    //             item.id === id
    //                 ? { ...item, heartCheck: !item.heartCheck }
    //                 : item
    //         )
    //     )
    // }

    return (
        <div className='insta'>
            <div className="inner">

                <SectionTitle
                    title="INSTAGRAM"
                    subtitle="Follow @matinkim_magazine"
                />

                <div className="insta-list-wrap">
                    <ul>
                        {insta.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={item.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="img-box">
                                        <img
                                            src={item.imgUrl}
                                            alt="instagram post"
                                        />
                                    </div>

                                    <div className="text-box">
                                        <div className='hash-wrap'>
                                            {item.hash.map((h, idx) => (
                                                <span key={idx}>
                                                    #{h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}