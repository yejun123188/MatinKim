import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./scss/KimMatinAbout.scss";

const sections = ["BRAND", "STOCKIST", "CONTACT"];
const stockistData = [
  {
    name: "SEONGSU FLAGSHIP STORE",
    address: "9 Yeonmujang 3-gil, Seongdong-gu, Seoul",
    link: "https://map.naver.com/v5/search/서울 성동구 연무장3길 9"
  },
  {
    name: "THE HYUNDAI — YEOUIDO",
    address: "2F, 108, Yeoui-daero, Yeongdeungpo-gu, Seoul",
    tel: "+82-2-3277-0879",
    link: "https://map.naver.com/v5/search/서울 영등포구 여의대로 108"
  },
  {
    name: "THE HYUNDAI — GANGNAM",
    address: "6F, 517, Teheran-ro, Gangnam-gu, Seoul",
    tel: "+82-2-3467-8665",
    link: "https://map.naver.com/v5/search/서울 강남구 테헤란로 517"
  },
  {
    name: "THE HYUNDAI — MOKDONG",
    address: "257, Mokdongdong-ro, Yangcheon-gu, Seoul",
    tel: "+82-2-2163-2247",
    link: "https://map.naver.com/v5/search/서울 양천구 목동동로 257"
  },
  {
    name: "THE HYUNDAI — DAEGU",
    address: "B2, 2077, Dalgubeol-daero, Jung-gu, Daegu",
    tel: "+82-53-245-3464",
    link: "https://map.naver.com/v5/search/대구 중구 달구벌대로 2077"
  },
  {
    name: "THE HYUNDAI — PANGYO",
    address: "4F, 20, Pangyoyeok-ro 146beon-gil, Bundang-gu, Seongnam-si",
    tel: "+82-31-5170-1415",
    link: "https://map.naver.com/v5/search/경기 성남시 분당구 판교역로146번길 20"
  },
  {
    name: "THE HYUNDAI — ULSAN",
    address: "5F, 261, Samsan-ro, Nam-gu, Ulsan",
    tel: "+82-52-228-0595",
    link: "https://map.naver.com/v5/search/울산 남구 삼산로 261"
  },
  {
    name: "LOTTE — SEOUL",
    address: "4F, 81, Namdaemun-ro, Jung-gu, Seoul",
    tel: "+82-2-772-3480",
    link: "https://map.naver.com/v5/search/서울 중구 남대문로 81"
  },
  {
    name: "LOTTE — ANYANG",
    address: "2F, 180, Simin-daero, Dongan-gu, Anyang-si",
    tel: "+82-62-360-1420",
    link: "https://map.naver.com/v5/search/경기 안양시 동안구 시민대로 180"
  },
  {
    name: "LOTTE — JEONJU",
    address: "2F, Ongoeul-ro, Wansan-gu, Jeonju-si",
    tel: "+82-63-289-3240",
    link: "https://map.naver.com/v5/search/전북 전주시 완산구 온고을로"
  },
  {
    name: "SHINSEGAE — DAEJEON",
    address: "3F, 1, Expo-ro, Yuseong-gu, Daejeon",
    tel: "+82-42-607-8508",
    link: "https://map.naver.com/v5/search/대전 유성구 엑스포로 1"
  },
  {
    name: "SHINSEGAE — GWANGJU",
    address: "5F, 932, Mujin-daero, Seo-gu, Gwangju",
    tel: "+82-507-1385-1420",
    link: "https://map.naver.com/v5/search/광주 서구 무진대로 932"
  },
];

const contactData = [
  {
    label: "HEAD OFFICE",
    lines: ["A-702 PDC, 242, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do"],
  },
  {
    label: "SHOW ROOM",
    lines: [
      "SEONGSU FLAGSHIP STORE",
      "9 Yeonmujang 3-gil, Seongdong-gu, Seoul",
      "11:00 AM — 08:00 PM",
      "070-4128-0703",
    ],
  },
  {
    label: "DISTRIBUTION CENTER",
    lines: [
      "94, Daewol-ro 932beon-gil, Daewol-myeon, Icheon-si, Gyeonggi-do (17342)",
      "10:00 AM — 06:00 PM (Weekday)",
    ],
  },
  {
    label: "CUSTOMER SERVICE",
    lines: [
      "11:00 AM — 05:00 PM (Mon — Fri)",
      "General: matinkimcrew@matinkim.com",
      "CS: matinkimcs@matinkim.com",
    ],
  },
  { label: "WHOLESALE", lines: ["matinkimcrew@matinkim.com"] },
  { label: "INSTAGRAM", lines: ["@kimmatin_magazine"] },
];

export default function KimMatinAbout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeFromPath = location.pathname.endsWith("/stockist")
    ? "STOCKIST"
    : location.pathname.endsWith("/contact")
      ? "CONTACT"
      : "BRAND";
  const handleTab = (s) => {
    if (s === activeFromPath) return;

    navigate(`/kimmatin/about/${s.toLowerCase()}`, { replace: true });
  };

  return (

    <div className="kma">
      <section className="kim-about">
        <nav className="kma__nav">
          {sections.map((s) => (
            <button
              key={s}
              className={`kma__nav-btn ${activeFromPath === s ? "is-active" : ""}`}
              onClick={() => handleTab(s)}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="kma__content" key={activeFromPath}>
          {activeFromPath === "BRAND" && (
            <div className="kma__brand">
              <div className="kma__brand-left">
                <p className="kma__index">01 — BRAND</p>
                <h2 className="kma__title">
                  THE BEAUTY<br />OF IMPERFECTION
                </h2>
                <div className="kma__divider" />
              </div>
              <div className="kma__brand-right">
                <p className="kma__body">
                  KIMMATIN, an upscale collection from Matin Kim, merges modern tailoring
                  with a distinctive roughness. It strikes a balance between contrasting
                  qualities — strong yet soft, structured yet flexible — defying
                  confinement to a single concept.
                </p>
                <p className="kma__body">
                  The collection features refined, chic items characterized by subtle yet
                  striking details. KIMMATIN embraces the beauty of imperfection, evident
                  in elements like casually cut hems and natural drapes.
                </p>
                <p className="kma__body kma__body--ko">
                  KIMMATIN 은 마뗑킴의 자유러운 러프함을 바탕으로 신선한 테일러링을
                  가미한 Matin Kim의 하이엔드 라인입니다. 강하고 부드러우며,
                  구조적이면서도 유연함을 가지는 양면적 가치사이에서 매력적인 균형을
                  제안하는 킴마틴은 하나의 개념에 얽매이지 않습니다.
                </p>
                <p className="kma__body kma__body--ko">
                  섬세하면서도 눈에 띄는 디테일이 돋보이는, 세련되고 시크한 아이템을
                  선보이며 무심하게 커팅된 밑단과 자연스러운 올풀림이 완벽하지 않기에
                  더욱 매력적인 미완성의 미학을 보여줍니다.
                </p>
              </div>
            </div>
          )}

          {activeFromPath === "STOCKIST" && (
            <div className="kma__stockist">
              <p className="kma__index">02 — STOCKIST</p>
              <h2 className="kma__title">OFFLINE STORE</h2>
              <div className="kma__stockist-grid">
                {stockistData.map((s, i) => (
                  <div key={i} className="kma__stockist-item">
                    <span className="kma__stockist-num">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <a href={s.link} target="_blank" rel="noopener noreferrer">
                        <p className="kma__stockist-name">{s.name}</p>
                      </a>
                      <p className="kma__stockist-addr">{s.address}</p>
                      {s.tel && <p className="kma__stockist-tel">{s.tel}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeFromPath === "CONTACT" && (
            <div className="kma__contact">
              <p className="kma__index">03 — CONTACT</p>
              <h2 className="kma__title">GET IN TOUCH</h2>
              <div className="kma__contact-grid">
                {contactData.map((item, i) => (
                  <div key={i} className="kma__contact-item">
                    <p className="kma__contact-label">{item.label}</p>
                    {item.lines.map((line, j) => (
                      <p key={j} className="kma__contact-line">{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
