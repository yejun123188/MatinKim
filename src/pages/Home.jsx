import React from 'react'
import Instagram from '../components/Instagram';


import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";
import Weeklybest from '../components/Weeklybest';
import NewArrivals from '../components/NewArrivals';
import ProjectsMain from '../components/ProjectsMain';

export default function Home() {
    return (
        <main>
            {/* 퀵메뉴 */}
            {/* 신상품 */}
            <NewArrivals />
            {/* 베스트 아이템 */}
            <Weeklybest />
            {/* 더 에딧 */}
            <TheEdit />
            {/* 플래그쉽 */}
            <Flagship />
            {/* 프로젝트 */}
            <ProjectsMain />
            {/* 인스타 */}
            <Instagram />
        </main>
    );
}
