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
        <section className='insta'>
            <div className="inner">

                <h2 className='insta-h2'><img src="./images/insta-icon/logo-icon.svg" alt="log" /><span>MATINKIM_MAGAZINE</span></h2>
                <div className="insta-list-wrap">
                    <ul>
                        {insta.map((item, id) =>
                            <li key={id}>
                                <Link to={item.linkUrl}>
                                    <div className="img-box">
                                        <img src={item.imgUrl} alt="" />
                                    </div>
                                    <div className="text-box">
                                        <div className='hash-wrap'>
                                            {item.hash.map((h, id) => <span key={id}>#{h}</span>)}

                                        </div>
                                        <button onClick={() => handleHeart(item.id)}>
                                            <img src={"./images/insta-icon/heart-icon-active.svg"} alt="" />
                                        </button>
                                    </div>
                                </Link>
                            </li>)}
                    </ul>
                </div>
            </div>
        </section>
    )
}
