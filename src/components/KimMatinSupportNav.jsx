import { Link, useLocation } from "react-router-dom";
import "./scss/HelpMenu.scss";

const supportMenus = [
  { label: "FAQ", path: "/kimmatin/faq" },
  { label: "1:1 문의", path: "/kimmatin/qna" },
  { label: "이용안내", path: "/kimmatin/guide" },
  { label: "개인정보처리방침", path: "/kimmatin/privacy-policy" },
  { label: "이용약관", path: "/kimmatin/terms" },
];

export default function KimMatinSupportNav() {
  const { pathname } = useLocation();

  return (
    <div className="qna-title-wrap km-support-nav">
      <aside className="qna-sidebar" aria-label="KIMMATIN support navigation">
        <ul>
          {supportMenus.map((menu) => (
            <li key={menu.path} className={pathname === menu.path ? "active is-active" : ""}>
              <Link to={menu.path}>{menu.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
