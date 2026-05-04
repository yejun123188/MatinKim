import React from "react";
import { Link } from "react-router-dom";
import { agreementData } from "../data/agreement";
import "./scss/Agreement.scss";
import HelpMenu from "../components/HelpMenu";

export default function Agreement() {
    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div>
                    <div className="qna-inner">
                        <HelpMenu />

                        <div className="qna-content">
                            <h2>T&amp;C</h2>

                            <div className="terms-box">
                                {agreementData.map((item, index) => (
                                    <div className="term-item" key={index}>
                                        <h3>{item.title}</h3>

                                        {item.content.map((text, idx) => (
                                            <p key={idx}>{text}</p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}