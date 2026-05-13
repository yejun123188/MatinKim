import React from "react";
import { Link } from "react-router-dom";
import KimMatinHelpMenu from "../components/KimMatinHelpMenu";
import "./scss/Qna.scss";
import "./scss/KimMatin.scss";

export default function KimMatinQna() {
  return (
    <section className="sub-section kimmatin-help-section">
      <div className="inner qna-page">
        <div className="qna-inner">
          <KimMatinHelpMenu />

          <div className="qna-content kimmatin-qna-write-link">
            <h2>1:1 문의</h2>
            <p>상품, 주문, 배송, 교환 및 반품 관련 문의를 남겨주세요.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
