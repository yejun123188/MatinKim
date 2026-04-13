import React, { useEffect, useState } from 'react'
import { instaData } from '../data/instaData';
import { like } from 'firebase/firestore/pipelines';
import { Link } from 'react-router-dom';
import "./scss/instagram.scss"


export default function Instagram() {
    const [insta, setInsta] = useState([]);
    useEffect(() => {
        setInsta(instaData)
    }, [])

    console.log("외부자료인스타", insta)

    // 하트 클릭시 변경되는 메서드
    const handleHeart = (id) => {
        console.log(id)
        setInsta((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, heartCheck: !item.heartCheck } : item
            )
        )
    }
    return (
        <section>
            <div className="inner">
                <h2 className='insta-h2'><img src="./images/insta-icon/Ellipse.png" alt="log" /><span>matinkim_Magazine</span></h2>
                <div className="insta-list-wrap">
                    <ul>
                        {insta.map((item, id) =>
                            <li key={id}>
                                <Link>
                                    <div className="img-box">
                                        <img src={item.imgUrl} alt="" />
                                    </div>
                                    <div className="text-box">
                                        <div className="icons">
                                            <button onClick={() => handleHeart(item.id)}>
                                                <img src={item.heartCheck ? "./images/insta-icon/heart-icon-active.png" : "./images/insta-icon/heart-icon.png"} alt="" />
                                            </button>
                                            <button><img src="/images/insta-icon/search-icon.png" alt="" /></button>
                                            <button><img src="/images/insta-icon/dm-icon.png" alt="" /></button>
                                        </div>
                                        <div className='hash-wrap'>
                                            {item.hash.map((h, id) => <span key={id}>#{h}</span>)}
                                        </div>
                                    </div>
                                </Link>
                            </li>)}
                    </ul>
                </div>
            </div>
        </section>
    )
}
