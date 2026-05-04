import React from "react";
import { guideData } from "../data/guideData";
import "./scss/Guide.scss";
import { Link } from "react-router-dom";
import HelpMenu from "../components/HelpMenu";

export default function Guide() {
    return (
        <section className="sub-section">
            <div className="inner qna-page">
                <div>
                    <div className="qna-inner">
                        <HelpMenu />

                        <div className="qna-content guide-content">
                            <h2>이용약관</h2>
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