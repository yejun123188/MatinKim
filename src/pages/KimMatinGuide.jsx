import KimMatinSupportNav from "../components/KimMatinSupportNav";
import { guideData } from "../data/guideData";
import "./scss/Guide.scss";
import "./scss/KimMatinSupport.scss";

export default function KimMatinGuide() {
  return (
    <section className="sub-section km-support-page">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner">
            <KimMatinSupportNav />

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
