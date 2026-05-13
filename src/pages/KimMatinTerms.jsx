import LegalMenu from "../components/LegalMenu";
import { kmTncData } from "../data/kmTncData";
import "./scss/KimMatinTerms.scss";

export default function KimMatinTerms() {
  return (
    <section className="terms-page">
      <div className="terms-inner">

        {/* 왼쪽 메뉴 */}
        <aside className="terms-left">
          <LegalMenu />
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className="terms-right">
          <h1>T&C</h1>

          {kmTncData.map((section) => (
            <section
              className="terms-section"
              key={section.id}
            >
              <h2>{section.title}</h2>

              <div className="terms-contents">

                {/* 일반 문단 */}
                {section.content?.map((text, idx) => (
                  <p key={idx}>
                    {text}
                  </p>
                ))}

                {/* 리스트 */}
                {section.list?.length > 0 && (
                  <ul>
                    {section.list.map((item, idx) => (
                      <li key={idx}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </main>

      </div>
    </section>
  );
}