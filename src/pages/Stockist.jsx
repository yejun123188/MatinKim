import React, { useEffect, useState } from 'react'
import "./scss/Stockist.scss"
import { useMapStore } from '../store/useMapStore';

const stockists = [
    { name: "Matin Kim GLOBAL", url: "https://matinkim.shop" },
    { name: "AMAZON", url: "https://www.amazon.com/" },
    { name: "HAGO", url: "https://www.hago.kr" },
    { name: "MUSINSA", url: "https://www.musinsa.com" },
    { name: "MUSINSA GLOBAL", url: "https://global.musinsa.com/us/main" },
    { name: "29CM", url: "https://www.29cm.co.kr" },
    { name: "KAKAO GIFT", url: "https://gift.kakao.com/brand/16887" },
    { name: "W CONCEPT", url: "https://display.wconcept.co.kr/rn/brand/109612" },
    { name: "NAVER SMART STORE", url: "https://brand.naver.com/matinkim" },
    { name: "SSF SHOP", url: "https://www.ssfshop.com" },
    { name: "FASHIONPLUS", url: "https://www.fashionplus.co.kr" },
    { name: "Matin Kim JAPAN", url: "https://matinkim.shop/ja/pages/stocklist" },
    { name: "Matin Kim TAIWAN", url: "https://www.matinkim.com.tw/" }
];



export default function Stockist() {
    const { initMap, onMenus, onFetchStore, country, stores, setMarkers, onShows, searchWord, onSearchWord } = useMapStore();



    const [topMenu, setTopMenu] = useState(true);
    const [clickAd, setClickAd] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google && window.google.maps) {
                initMap(37.5435, 127.0543);
                clearInterval(interval);
            }
        }, 100);

        onFetchStore();

        return () => clearInterval(interval);
    }, []);
    return (
        <div className='stock'>
            <div className="inner">
                <div className="map">
                    <div className="map-left">
                        <div id="map" style={{ width: "720px", height: "720px" }}>

                        </div>
                    </div>
                    <div className="map-right">
                        <div className="top-menu">
                            <div className={topMenu ? "active" : ""} onClick={() => { onMenus("offline_store"); setTopMenu(true); }} >OFFLINE STORE</div>
                            <div className={topMenu ? "" : "active"} onClick={() => { onMenus("select_shop"); setTopMenu(false) }}>SELECT SHOP</div>
                        </div>
                        <div className="menu-box">
                            <div className="top">
                                <select name="" onChange={(e) => onShows(e.target.value)}>
                                    {country.map((c, i) => (
                                        <option key={i} value={c}>{c}</option>
                                    ))}
                                </select>

                                <label>
                                    <input type="text" placeholder='매장명 또는 주소를 입력해주세요' value={searchWord}
                                        onChange={(e) => onSearchWord(e.target.value)} />
                                </label>


                                <button>찾기</button>
                            </div>
                            <div className="show">
                                <ul className="store-list">

                                    {stores.map((s, id) => (
                                        <div key={id}>
                                            {s.stores.map((ss, i) => (
                                                <li onClick={() => { setMarkers(ss.lat, ss.lng); setClickAd(i) }}
                                                    className={clickAd === i ? "active" : ""} key={i}>
                                                    <p className="name">{ss.name}</p>
                                                    <p className="address">{ss.address}</p>
                                                    <p className='tel'>{ss.tel}</p>

                                                </li>
                                            ))
                                            }
                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="img">
                <img src="/images/sub-about/stock.png" alt="" />
            </div>
            <div className="inner">
                <h4 className="stock-title">ONLINE STORE</h4>
                <div className="online-store">

                    {stockists.map((s, id) => (
                        <ul className="store" key={id}>
                            <li className='store-name' >{s.name}
                                <span><img src="/images/sub-about/arrow-up.svg" alt="" /></span>
                            </li>
                            <li><a href={s.url}>{s.url}</a></li>
                        </ul>
                    ))}
                </div>
                <div className="story-text">
                    <p>Matin Kim strives to harmonize a distinctive sense of freedom and a rough style <br />
                        within the diverse tapestry of daily fashion cultures.
                    </p>
                </div>
            </div>
        </div >
    )
}
