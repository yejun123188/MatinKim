import React, { useState } from "react";
import { faqTabs, qnadata } from "../data/Qna";
import "./scss/Qna.scss";
import { Link } from "react-router-dom";

export default function Qna() {
    const [activeTab, setActiveTab] = useState("top5");
    const [openId, setOpenId] = useState(null);
    const [activeMenu, setActiveMenu] = useState("FAQ");

    const currentFaqs = qnadata[activeTab] || [];

    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
        setOpenId(null);
    };

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div className="qna-page">
                    <div className="qna-inner">
                        <div className="qna-title-wrap">
                            <h2>Help</h2>
                        </div>

                        <div className="qna-content">
                            <aside className="qna-sidebar">
                                <ul>
                                    <li
                                        className={activeMenu === "FAQ" ? "active" : ""}>
                                        <Link to="/qna" onClick={() => handleMenuClick("FAQ")}> FAQ
                                        </Link>


                                    </li>

                                    <li
                                        className={activeMenu === "1:1 문의" ? "active" : ""}
                                        onClick={() => handleMenuClick("1:1 문의")}
                                    >
                                        1:1 문의
                                    </li>

                                    <li
                                        className={activeMenu === "이용안내" ? "active" : ""}>

                                        <Link to="/guide" onClick={() => handleMenuClick("이용안내")}>
                                            이용안내</Link>
                                    </li>

                                    <li
                                        className={activeMenu === "개인정보처리방침" ? "active" : ""}>
                                        <Link to="/privacy" onClick={() => handleMenuClick("개인정보처리방침")} >

                                            개인정보처리방침</Link>
                                    </li>

                                    <li
                                        className={activeMenu === "이용약관" ? "active" : ""}>
                                        <Link to="/agreement" onClick={() => handleMenuClick("이용약관")}>

                                            이용약관</Link>

                                    </li>
                                </ul>
                            </aside>

                            <div className="qna-main">
                                <h3>FAQ</h3>

                                <div className="qna-tabs">
                                    {faqTabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            className={activeTab === tab.key ? "active" : ""}
                                            onClick={() => handleTabClick(tab.key)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="qna-list">
                                    {currentFaqs.map((item) => {
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
                                                    <span className="qna-icon">{isOpen ? "−" : "+"}</span>
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
                </div>
            </div>
        </section>
    );
}