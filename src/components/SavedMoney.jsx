import React, { useState } from 'react'
import "./scss/SavedMoney.scss"

const data = {
    history: [
        { date: "2026-04-08", point: "5000원", order: "-", desc: "신규회원 적립금" }
    ],
    pending: [
        { date: "2026-04-09", point: "2000원", order: "-", desc: "배송 대기 적립금" }
    ],
    grade: [
        { date: "2026-04-10", point: "1000원", order: "-", desc: "회원등급 적립금" }
    ]
};
export default function SavedMoney() {
    const [tab, setTab] = useState("history");
    return (
        <div className='savedmoney-wrap'>
            <div className="saved-top">
                <div className="my-saved">
                    <p>내 적립금</p>
                </div>
                <div className="my-saved-middle">
                    <div className="list-wrap">
                        <ul className="left-list">
                            <li><div className="text">•총 적립금</div><p className="price">5000원</p></li>
                            <li><div className="text">•사용가능 적립금</div><p className="price">5000원</p></li>
                            <li><div className="text">•사용된 적립금</div><p className="price">5000원</p></li>
                        </ul>
                        <ul className="right-list">
                            <li><div className="text">•미가용 적립금</div><p className="price">5000원</p></li>
                            <li><div className="text">•환불예정 적립금</div><p className="price">5000원</p></li>

                        </ul>
                    </div>
                    <ul className="explain-list">
                        <li>•주문으로 발생한 적립금은 배송완료 후 7일 부터 실제 사용 가능한 적립금으로 전환됩니다. 배송완료 시점으로부터 7일 동안은 미가용 적립금으로 분류됩니다.</li>
                        <li>•미가용 적립금은 반품, 구매취소 등을 대비한 임시 적립금으로 사용가능 적립금으로 전환되기까지 상품구매에 사용하실 수 없습니다.</li>
                        <li>•사용가능 적립금(총적립금 - 사용된적립금 - 미가용적립금)은 상품구매 시 바로 사용가능합니다.</li>
                    </ul>
                </div>

            </div>
            <div className="saved-bottom">
                <div className="top-menu">
                    <p className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>적립내역 보기</p>
                    <p className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>미가용적립내용보기</p>
                    <p className={tab === "grade" ? "active" : ""} onClick={() => setTab("grade")}>미가용쿠폰/회원등급적립내역</p>
                </div>

                <table>
                    <tr>
                        <th>주문날짜</th><th>적립금</th><th>관련주문</th><th>내용</th>

                    </tr>
                    {data[tab].map((item, i) => (
                        <tr key={i}>
                            <td>{item.date}</td>
                            <td>{item.point}</td>
                            <td>{item.order}</td>
                            <td>{item.desc}</td>
                        </tr>
                    ))}
                </table>

            </div>

        </div>
    )
}
