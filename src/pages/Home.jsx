import React from 'react'
import Instagram from '../components/Instagram';


import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";
import Weeklybest from '../components/Weeklybest';
import NewArrivals from '../components/NewArrivals';
import MainTop from '../components/MainTop';
import Collection from '../components/Collection';
import ShortCut from '../components/ShortCut';
import TimeSalePopup from '../components/TimeSalePopup';

export default function Home() {
    return (
        <>
            {/* 팝업 */}
            <TimeSalePopup />

            <main>
                {/* 메인 상단 */}
                <MainTop />
                {/* 퀵메뉴 */}
                <ShortCut />
                {/* 신상품 */}
                <NewArrivals />
                {/* 베스트 아이템 */}
                <Weeklybest />
                {/* 더 에딧 */}
                <TheEdit />
                {/* 플래그쉽 */}
                <Flagship />
                {/* 프로젝트 */}
                <Collection />
                {/* 인스타 */}
                <Instagram />
            </main>
        </>
    );
}
