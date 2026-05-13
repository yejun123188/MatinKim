import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./scss/HelpMenu.scss";

const menus = [
  { label: "FAQ", path: "/kimmatin/faq" },
  { label: "1:1 문의", path: "/kimmatin/qna" },
  { label: "이용안내", path: "/kimmatin/guide" },
  { label: "개인정보처리방침", path: "/kimmatin/privacy-policy" },
  { label: "이용약관", path: "/kimmatin/terms" },
];

export default function KimMatinHelpMenu() {
  const location = useLocation();

  return (
    <div className="qna-title-wrap">
      <aside className="qna-sidebar">
        <ul>
          {menus.map((menu) => (
            <li
              key={menu.path}
              className={location.pathname === menu.path ? "active" : ""}
            >
              <Link to={menu.path}>{menu.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
