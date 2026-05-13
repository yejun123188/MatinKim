import React from "react";
import KimMatinHelpMenu from "../components/KimMatinHelpMenu";
import "./scss/Qna.scss";
import "./scss/KimMatin.scss";

const privacyBlocks = [
  {
    title: "수집하는 개인정보 항목 및 수집방법",
    content: [
      "회사는 회원가입, 상담, 서비스 신청 등을 위해 필요한 개인정보를 수집합니다.",
      "서비스 이용 과정에서 접속 로그, 쿠키, 접속 IP, 결제 기록 등이 생성되어 수집될 수 있습니다.",
    ],
  },
  {
    title: "개인정보의 수집 및 이용목적",
    content: [
      "수집한 개인정보는 서비스 제공, 구매 및 요금 결제, 물품 배송, 회원 관리, 고객 상담을 위해 사용합니다.",
      "이벤트 및 광고성 정보 전달, 접속 빈도 파악, 서비스 이용 통계에도 활용될 수 있습니다.",
    ],
  },
  {
    title: "개인정보의 보유 및 이용기간",
    content: [
      "개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.",
      "관계 법령에 따라 보존할 필요가 있는 경우에는 정해진 기간 동안 보관합니다.",
    ],
  },
  {
    title: "개인정보 보호 문의",
    content: [
      "개인정보 보호와 관련된 문의는 고객센터 또는 비즈니스 메일을 통해 접수할 수 있습니다.",
      "Business Contact : matinkimcrew@matinkim.com",
    ],
  },
];

export default function KimMatinPrivacy() {
  return (
    <section className="sub-section kimmatin-help-section">
      <div className="inner qna-page">
        <div>
          <div className="qna-inner privacy-inner">
            <KimMatinHelpMenu />

            <div className="qna-content privacy-content">
              <h2>개인정보처리방침</h2>
              {privacyBlocks.map((block) => (
                <div className="policy-block" key={block.title}>
                  <h3>{block.title}</h3>
                  {block.content.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
