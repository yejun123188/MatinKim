import React from 'react'
import "./scss/About.scss"
const instagram = [
    { src: "/images/sub-about/Rectangle1.png", link: "" },
    { src: "/images/sub-about/Rectangle2.png", link: "" },
    { src: "/images/sub-about/Rectangle3.png", link: "" },
    { src: "/images/sub-about/Rectangle4.png", link: "" },
    { src: "/images/sub-about/Rectangle5.png", link: "" },
    { src: "/images/sub-about/Rectangle6.png", link: "" },
]

export default function About() {
    return (
        <>
            <div className='inner'>
                <div className="about-top">
                    <div className="img-box">
                        <img src="/images/sub-about/about.png" alt="" />
                    </div>
                    <div className="text-box">
                        <div className="brand">
                            <h4 className="about-title">Brand </h4>
                            <ul className="text">
                                <li>
                                    마뗑킴(MATIN KIM)은 트렌디하면서도 편안하고,<br />
                                    일상에서 조화롭게 적용할 수 있는 패션 문화를 지향합니다.
                                </li>
                                <li>
                                    Matin Kim strives to harmonize a distinctive sense of freedom and a  <br />
                                    rough style within the diverse tapestry of daily fashion cultures.
                                </li>
                            </ul>
                        </div>
                        <div className="contact">
                            <h4 className="about-title">Concat </h4>
                            <ul className="text">
                                <li>
                                    Matin Kim customer service is at your disposal <br />
                                    Please email us
                                </li>
                                <li>
                                    matinkimcrew@matinkim.com
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="line"></div>
                <div className="about-bottom">
                    <div className="img-box">
                        <img src="/images/sub-about/aboutmap.png" alt="" />

                    </div>
                    <div className="text-box">
                        <div className="location">
                            <h4 className="about-title">Location </h4>
                            <ul className="text2">
                                <li>
                                    <h5>HEAD OFFICE</h5>
                                    <p>경기도 성남시 분당구 판교로 242, 판교디지털센터(PDC) A동 702호 <br />
                                        A-702 PDC, 242, Pangyo-ro, Bundang-gu, Seongnam-si, <br />
                                        Gyeonggi-do, Republic of Korea
                                    </p>
                                </li>
                                <li>
                                    <h5>SHOW ROOM</h5>
                                    <p>SEONGSU FLAGSHIP STORE <br />
                                        9 Yeonmujang 3-gil, Seongdong-gu, Seoul <br />
                                        11:00 AM ~ 08:00PM (매일) <br />
                                        070-4128-0703
                                    </p>
                                </li>
                                <li>
                                    <h5>DISTRIBUTION CENTER</h5>
                                    <p>배송 물류센터
                                        경기도 이천시 대월면 대월로932번길 94 (대월면) 로젠택배 대리점,<br />
                                        M&C(마뗑킴)94, Daewol-ro 932beon-gil, Daewol-myeon, Icheon-si,<br />
                                        Gyeonggi-do, Republic of Korea (17342)<br />
                                        10:00 AM ~ 06:00 PM (평일)
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="business">
                            <h4 className="about-title">Business </h4>
                            <ul className="text2">
                                <li>
                                    <h5>WHOLESALE</h5>
                                    <p>matinkimcrew@matinkim.com </p>
                                </li>
                                <li>
                                    <h5>CUSTOMER SERVICE</h5>
                                    <p>고객센터 <br />
                                        비즈니스 관련문의: matinkimcrew@matinkim.com </p>
                                </li>
                                <li>
                                    <h5>ACCOUNT NUMBER</h5>
                                    <p>기업은행 033-505930-01-045 (주)마뗑킴 </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <p className="insta-title">#instagram</p>
            <div className="insta">
                <ul className="insta-list">
                    {instagram.map((e, id) => (
                        <li><a href=""><img src={e.src} alt="" /></a></li>
                    ))}
                </ul>
            </div>
        </>
    )
}
