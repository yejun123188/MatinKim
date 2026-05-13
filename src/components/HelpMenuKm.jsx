import React, { useState } from "react";
import "./scss/HelpMenuKm.scss";
import { Link } from "react-router-dom";

export default function HelpMenuKm() {
    const [activeTab, setActiveTab] = useState("faq");

    return (
        <div className="help-menu-km">
            <h2 className="help-title">HELP</h2>

            <div className="help-tab-wrap">
                <Link to="/kimmatin/faq">
                    <button
                        className={`help-tab ${activeTab === "faq" ? "active" : ""}`}
                        onClick={() => setActiveTab("faq")}
                    >
                        FAQ
                    </button>
                </Link>

                <Link to="/kimmatin/qna">
                    <button
                        className={`help-tab ${activeTab === "qna" ? "active" : ""}`}
                        onClick={() => setActiveTab("qna")}
                    >
                        Q&amp;A
                    </button>
                </Link>
            </div>
        </div>
    );
}