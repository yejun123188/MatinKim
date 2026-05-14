import React from "react";
import "./scss/LegalMenu.scss";
import { Link } from "react-router-dom";

export default function LegalMenu() {
    return (
        <div className="legal-menu">
            <h2>LEGAL</h2>

            <ul>
                <li className="active"><Link to="/kimmatin/guide">GUIDE</Link></li>
                <li> <Link to="/kimmatin/privacy-policy">
                    PRIVACY POLICY
                </Link></li>
                <li><Link to="/kimmatin/terms">T&amp;C</Link></li>
            </ul>
        </div>
    );
}