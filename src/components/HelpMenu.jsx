import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLoginStore } from "../store/useLoginStore";
import { useAuthStore } from "../store/useAuthStore"; import { useNavigate } from "react-router-dom";
import "./scss/HelpMenu.scss";

export default function HelpMenu() {
    const location = useLocation();
    const { openLogin } = useLoginStore();

    const { user } = useAuthStore();
    const menus = [
        { label: "FAQ", path: "/qna" },
        { label: "1:1 문의", path: "/board" },
        { label: "이용안내", path: "/guide" },
        { label: "개인정보처리방침", path: "/privacy" },
        { label: "이용약관", path: "/agreement" },
    ];


    const handleInquiryClick = () => {
        // 로그인 되어있으면 이동
        if (user) {
            navigate("/board");
        } else {
            // 로그인 안되어있으면 로그인창
            openLogin();
        }
    };

    const navigate = useNavigate();




    return (
        <div className="qna-title-wrap">
            <aside className="qna-sidebar">
                <ul>
                    {menus.map((menu) => (
                        <li
                            key={menu.path}
                            className={location.pathname === menu.path ? "active" : ""}
                        >
                            {menu.label === "1:1 문의" ? (
                                <button onClick={handleInquiryClick}>
                                    {menu.label}
                                </button>
                            ) : (
                                <Link to={menu.path}>{menu.label}</Link>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>

        </div>
    );
}