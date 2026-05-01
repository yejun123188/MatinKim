import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLoginStore } from "../store/useLoginStore";


export default function HelpMenu() {
    const location = useLocation();
    const { openLogin } = useLoginStore();

    const menus = [
        { label: "FAQ", path: "/qna" },
        { label: "1:1 문의", path: "/login" },
        { label: "이용안내", path: "/guide" },
        { label: "개인정보처리방침", path: "/privacy" },
        { label: "이용약관", path: "/agreement" },
    ];

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
                                <button onClick={openLogin}>
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