

import React, { useState } from "react";
import { faqTabs, qnadata } from "../data/Qna";
import "./scss/Qna.scss";
import HelpMenu from "../components/HelpMenu";

export default function Qna() {
    const [activeTab, setActiveTab] = useState("top5");
    const [openId, setOpenId] = useState(null);

    // 탭 클릭
    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
        setOpenId(null);
    };

    // 아코디언 열기/닫기
    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div className="qna-inner">
                    <HelpMenu />

                    <div className="qna-content">
                        <h2>FAQ</h2>
                        {/* ✅ 탭 메뉴 */}
                        <div className="qna-tabs">
                            {faqTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={activeTab === tab.key ? "active" : ""}
                                    onClick={() => handleTabClick(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ✅ QnA 리스트 */}
                        <div className="qna-list">
                            {qnadata[activeTab]?.map((item) => {
                                const isOpen = openId === item.id;

                                return (
                                    <div
                                        className={`qna-item ${isOpen ? "open" : ""}`}
                                        key={item.id}
                                    >
                                        <button
                                            type="button"
                                            className="qna-question"
                                            onClick={() => handleToggle(item.id)}
                                        >
                                            <span>{item.q}</span>
                                            <span className="qna-icon">
                                                {isOpen ? "−" : "+"}
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div className="qna-answer">
                                                {item.a.split("\n").map((line, index) => (
                                                    <p key={index}>{line}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}