import React from 'react'
import SectionTitle from './SectionTitle'
import { Link } from 'react-router-dom'

import "./scss/theedit.scss"

const edits = [
    {
        src: "./images/main-theedit/edit1.png", alt: "edit1", title: "Matin Kim X Nct jeno", subscribe: "'No Rush!'", link: "",
        sub: [
            { img: "", name: "상품제목들어감", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" },
            { img: "", name: "2", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" }
        ]
    },
    {
        src: "./images/main-theedit/edit2.png", alt: "edit2", title: "Matin kim x Liz ", subscribe: "'BUCKET LIST'", link: "",
        sub: [
            { img: "", name: "상품제목들어감", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" },
            { img: "", name: "2", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" }
        ]
    },
    {
        src: "./images/main-theedit/edit3.png", alt: "edit3", title: "Matin kim x Ningning", subscribe: "'Record 2'", link: "",
        sub: [
            { img: "", name: "상품제목들어감", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" },
            { img: "", name: "2", price: "₩89,000", colors: ["#ED7171", "#4D4D4D", "#008318"], link: "" }
        ]
    }
]

export default function TheEdit() {
    return (
        <section className="the-edit-section">
            <div className="inner">
                <SectionTitle title="THE EDIT" subtitle="Chosen by jeno, liz, ningning" />
                <div className='edit-wrap'>
                    {edits.map((e, id) => (
                        <div className="edit-list" key={id}>
                            <div className="top">
                                <Link>
                                    {/* 포스트사진 누르면 링크해서 컬랙션 - 컬렉션 상세페이지로 이동 */}
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
                                {e.sub.map((s, id) => (
                                    <div className='bottom-edit-list' key={id}>
                                        {/* 제품 누르면 제품 상세페이지로 이동 */}
                                        <Link>
                                            <div className="img-box">
                                                <img src={s.src} alt="사진들어감" />
                                            </div>
                                            <ul className="text-box">
                                                <li>{s.name}</li>
                                                <li>{s.price}</li>
                                                <li>{s.colors.map((c, id) => (
                                                    <span key={id} style={{ backgroundColor: c }}>색상선택</span>
                                                ))}</li>
                                            </ul>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
