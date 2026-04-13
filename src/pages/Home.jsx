import React from 'react'
import Instagram from '../components/Instagram';


export default function Home() {
    return (
        <div className='inner'>
            <Instagram />
        </div>
    );
import React from "react";
import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";

export default function Home() {
  return (
    <div className="inner">
      <main>
        {/* 퀵메뉴 */}
        {/* 신상품 */}
        {/* 베스트 아이템 */}
        {/* 더 에딧 */}
        <TheEdit />
        {/* 플래그쉽 */}
        <Flagship />
        {/* 프로젝트 */}
        {/* 인스타 */}

      </main>
    </div>
  );
}
