import React from "react";
import "./scss/userInfoNone.scss";

export default function UserInfoNone({ title }) {
  return (
    <div className="none-info-wrap">
      <img src="./images/userinfo/i.svg" alt="info icon" />
      <p>{title} 내역이 없습니다.</p>
    </div>
  );
}
