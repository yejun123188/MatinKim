import React, { useState } from "react";
import KimMatinHelpMenu from "../components/KimMatinHelpMenu";
import { faqTabs, qnadata } from "../data/Qna";
import "./scss/Qna.scss";
import "./scss/KimMatin.scss";

export default function KimMatinFaq() {
  const [activeTab, setActiveTab] = useState("top5");
  const [openId, setOpenId] = useState(null);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setOpenId(null);
  };

  return (
    <section className="sub-section kimmatin-help-section">
      <div className="inner qna-page">
        <div className="qna-inner">
          <KimMatinHelpMenu />

          <div className="qna-content">
            <h2>FAQ</h2>
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

            <div className="qna-list">
              {qnadata[activeTab]?.map((item) => {
                const isOpen = openId === item.id;

                return (
                  <div className={`qna-item ${isOpen ? "open" : ""}`} key={item.id}>
                    <button
                      type="button"
                      className="qna-question"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                    >
                      <span>{item.q}</span>
                      <span className="qna-icon">{isOpen ? "-" : "+"}</span>
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
