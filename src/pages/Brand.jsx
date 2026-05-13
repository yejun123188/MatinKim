import React, { useEffect, useRef } from 'react'
import "./scss/Brand.scss"

const instagram = [
    { src: "/images/sub-about/Rectangle1.png", link: "https://www.instagram.com/p/DUksFOTEt6R/?hl=ko&img_index=1" },
    { src: "/images/sub-about/Rectangle2.png", link: "https://www.instagram.com/p/DUsToslkpEc/?hl=ko&img_index=1" },
    { src: "/images/sub-about/Rectangle3.png", link: "https://www.instagram.com/p/DVGDmOYEgHL/?hl=ko&img_index=1" },
    { src: "/images/sub-about/Rectangle4.png", link: "https://www.instagram.com/p/DTH_dL1kgRY/?hl=ko&img_index=1" },
    { src: "/images/sub-about/Rectangle5.png", link: "https://www.instagram.com/p/DTwVT4HkhYs/?hl=ko" },
    { src: "/images/sub-about/Rectangle6.png", link: "https://www.instagram.com/p/DTzqK6xEmKB/?hl=ko" },
]

const locations = [
    {
        label: "HEAD OFFICE",
        lines: [
            "경기도 성남시 분당구 판교로 242",
            "판교디지털센터(PDC) A동 702호",
            "A-702 PDC, 242, Pangyo-ro, Bundang-gu",
            "Seongnam-si, Gyeonggi-do, Republic of Korea",
        ]
    },
    {
        label: "SHOW ROOM",
        lines: [
            "SEONGSU FLAGSHIP STORE",
            "9 Yeonmujang 3-gil, Seongdong-gu, Seoul",
            "11:00 AM – 08:00 PM (매일)",
            "070-4128-0703",
        ]
    },
    {
        label: "DISTRIBUTION CENTER",
        lines: [
            "경기도 이천시 대월면 대월로932번길 94",
            "로젠택배 대리점, M&C(마뗑킴)",
            "Daewol-myeon, Icheon-si, Gyeonggi-do (17342)",
            "10:00 AM – 06:00 PM (평일)",
        ]
    },
]

const business = [
    {
        label: "WHOLESALE",
        lines: ["matinkimcrew@matinkim.com"]
    },
    {
        label: "CUSTOMER SERVICE",
        lines: ["고객센터", "matinkimcrew@matinkim.com"]
    },
    {
        label: "ACCOUNT NUMBER",
        lines: ["기업은행 033-505930-01-045", "(주)마뗑킴"]
    },
]

export default function Brand() {
    const heroRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.1 }
        )
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <>
            <div className='brand-page inner'>

                {/* ── HERO ── */}
                <section className='brand-hero' ref={heroRef}>
                    <div className='brand-hero__img'>
                        <img src="/images/sub-about/about.png" alt="Matin Kim" />
                    </div>
                    <div className='brand-hero__text'>
                        <p className='brand-hero__eyebrow'>Brand Story</p>
                        <h1 className='brand-hero__name'>MATIN<br />KIM</h1>
                        <div className='brand-hero__divider' />
                        <p className='brand-hero__ko'>
                            마뗑킴은 트렌디하면서도 편안하고,<br />
                            일상에서 조화롭게 적용할 수 있는<br />
                            패션 문화를 지향합니다.
                        </p>
                        <p className='brand-hero__en'>
                            Matin Kim strives to harmonize a distinctive sense<br />
                            of freedom and a rough style within the diverse<br />
                            tapestry of daily fashion cultures.
                        </p>
                        <a href="mailto:matinkimcrew@matinkim.com" className='brand-hero__cta'>
                            matinkimcrew@matinkim.com
                            <span className='brand-hero__arrow'>→</span>
                        </a>
                    </div>
                </section>

                {/* ── MAP + INFO ── */}
                <section className='brand-info reveal'>
                    <div className='brand-info__map'>
                        <img src="/images/sub-about/aboutmap.png" alt="Location map" />
                    </div>

                    <div className='brand-info__cols'>
                        <div className='brand-info__col'>
                            <p className='brand-info__section-label'>Location</p>
                            {locations.map((loc) => (
                                <div key={loc.label} className='brand-info__item'>
                                    <p className='brand-info__item-label'>{loc.label}</p>
                                    {loc.lines.map((l, i) => (
                                        <p key={i} className='brand-info__item-line'>{l}</p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className='brand-info__col'>
                            <p className='brand-info__section-label'>Business</p>
                            {business.map((b) => (
                                <div key={b.label} className='brand-info__item'>
                                    <p className='brand-info__item-label'>{b.label}</p>
                                    {b.lines.map((l, i) => (
                                        <p key={i} className='brand-info__item-line'>{l}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



            </div>
            {/* ── INSTAGRAM ── */}
            {/* <section className='brand-insta reveal'>
                <div className='brand-insta__header'>
                    <span className='brand-insta__hash'>#</span>
                    <span className='brand-insta__word'>instagram</span>
                </div>
                <ul className='brand-insta__grid'>
                    {instagram.map((e, id) => (
                        <li key={id} className='brand-insta__item'>
                            <a href={e.link} target="_blank" rel="noopener noreferrer">
                                <img src={e.src} alt={`Instagram post ${id + 1}`} />
                                <div className='brand-insta__hover'>
                                    <span>↗</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </section> */}
        </>
    )
}
