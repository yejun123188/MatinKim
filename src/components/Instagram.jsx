import React, { useEffect, useState } from 'react'
import { instaData } from '../data/instaData'
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'
import "./scss/instagram.scss"

export default function Instagram() {
    const [insta, setInsta] = useState([])

    useEffect(() => {
        setInsta(instaData)
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
                                <Link to={item.linkUrl}>

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

                                        {/* <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleHeart(item.id)
                                            }}
                                        >
                                            <img
                                                src={
                                                    item.heartCheck
                                                        ? "./images/insta-icon/heart-fill-icon.svg"
                                                        : "./images/insta-icon/heart-icon.svg"
                                                }
                                                alt="heart"
                                            />
                                        </button> */}

                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}