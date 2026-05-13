import LegalMenu from "../components/LegalMenu";
import { kmGuideData } from "../data/kmGuideData";
import "./scss/KimMatinGuide.scss";

export default function KimMatinGuide() {
  return (
    <section className="guide-page">
      <div className="guide-inner">

        {/* 왼쪽 메뉴 */}
        <aside className="guide-left">
          <LegalMenu />
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className="guide-right">
          <h1>GUIDE</h1>

          {kmGuideData.map((section, index) => (
            <section
              className="guide-section"
              key={index}
            >
              <h2>{section.category}</h2>

              <div className="guide-contents">
                {section.contents.map((content, idx) => (
                  <p key={idx}>
                    {content}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </main>

      </div>
    </section>
  );
}