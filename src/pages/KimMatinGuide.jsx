import React from "react";
import KimMatinHelpMenu from "../components/KimMatinHelpMenu";
import { guideData } from "../data/guideData";
import "./scss/Qna.scss";
import "./scss/Guide.scss";
import "./scss/KimMatin.scss";

export default function KimMatinGuide() {
  return (
    <section className="sub-section kimmatin-help-section">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner">
            <KimMatinHelpMenu />

            <div className="qna-content guide-content">
              {guideData.map((section, idx) => (
                <article className="guide-section" key={idx}>
                  <h3>{section.title}</h3>
                  {section.paragraphs?.map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                  {section.list && (
                    <ul>
                      {section.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.subTitle && <h4>{section.subTitle}</h4>}
                  {section.subList && (
                    <ul>
                      {section.subList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
