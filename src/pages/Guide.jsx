import React from "react";
import { guideData } from "../data/guideData";
import "./scss/Guide.scss";

export default function Guide() {
    return (
        <section className="sub-section">
            <div className="inner guide-page">
                <div className="guide-page">
                    <div className="guide-inner">
                        <aside className="guide-side">

                        </aside>

                        <div className="guide-content">
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