import React from "react";
import "./scss/LegalMenu.scss";
import { NavLink } from "react-router-dom";

export default function LegalMenu() {
    return (
        <div className="legal-menu">
            <h2>LEGAL</h2>

            <ul>
                <li>
                    <NavLink
                        to="/kimmatin/guide"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        GUIDE
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/kimmatin/privacy-policy"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        PRIVACY POLICY
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/kimmatin/terms"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        T&amp;C
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}