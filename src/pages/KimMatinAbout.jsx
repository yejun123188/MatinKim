import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./scss/About.scss";
import "./scss/KimMatin.scss";

const aboutMenus = [
  { key: "brand", label: "BRAND", path: "brand" },
  { key: "stockist", label: "STOCKIST", path: "stockist" },
  { key: "contact", label: "CONTACT", path: "contact" },
];

export default function KimMatinAbout() {
  return (
    <section>
      <div></div>
    </section>
  );
}
