import LegalMenu from "../components/LegalMenu";
import { kmPrivacyData } from "../data/kmPrivacyData";
import "./scss/KimMatinPrivacy.scss";

export default function KimMatinPrivacy() {
  return (
    <section className="privacy-page">
      <div className="privacy-inner">

        {/* 왼쪽 메뉴 */}
        <aside className="privacy-left">
          <LegalMenu />
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className="privacy-right">
          <h1>PRIVACY POLICY</h1>

          {kmPrivacyData.map((section) => (
            <section
              className="privacy-section"
              key={section.id}
            >
              <h2>{section.title}</h2>

              <ul className="privacy-contents">
                {section.contents.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>

      </div>
    </section>
  );
}