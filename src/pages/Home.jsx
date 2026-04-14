import React from 'react'
import Instagram from '../components/Instagram';


import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";
import ShortCut from '../components/ShortCut';

export default function Home() {
    return (
        <div className="inner">
            <main>
                {/* 퀵메뉴 */}
                <ShortCut />
                {/* 신상품 */}
                {/* 베스트 아이템 */}
                {/* 더 에딧 */}
                <TheEdit />
                {/* 플래그쉽 */}
                <Flagship />
                {/* 프로젝트 */}
                {/* 인스타 */}
                <Instagram />

            </main>
        </div>
    );
}
