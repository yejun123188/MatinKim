import React from "react";
import KimMatinHelpMenu from "../components/KimMatinHelpMenu";
import { agreementData } from "../data/agreement";
import "./scss/Qna.scss";
import "./scss/Agreement.scss";
import "./scss/KimMatin.scss";

export default function KimMatinTerms() {
  return (
    <section className="sub-section kimmatin-help-section">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner">
            <KimMatinHelpMenu />

            <div className="qna-content">
              <h2>이용약관</h2>
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
