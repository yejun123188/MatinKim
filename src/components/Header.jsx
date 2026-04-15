import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./scss/Header.scss";
import { useProductStore } from "../store/useProductStore";
import Login from "../pages/Login";

const topmenus = [
  { key: "shop", label: "SHOP" },
  { key: "project", label: "PROJECT" },
  { key: "collections", label: "COLLECTIONS" },
  { key: "about", label: "ABOUT" },
];
const defaultMenus = [
  { name: "SALE", link: "/sale" },
  { name: "NEW IN", link: "/newin" },
  { name: "MUST HAVE", link: "/musthave" },
  { name: "COLLAB", link: "/collab" },
  { name: "ALL", link: "/all" },
];
const photoMenu = [
  {
    src: "/images/collection/liz/img_liz_00007.jpg",
    subtitle: "MATIN KIM X LIZ",
    title: "26 S/S COLLECTION",
  },
  {
    src: "/images/collection/liz/img_liz_00006.jpg",
    subtitle: "26 Summer",
    title: "HOUSE, HAUS!",
  },
  {
    src: "/images/collection/liz/img_liz_00020.jpg",
    subtitle: "Matin Kim MAGAZINE",
    title: "BUCKET LIST",
  },
];

export default function Header() {
  const { menus } = useProductStore();
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <div className={`header-show ${isScrolled ? "scrolled" : ""}`}>
        <div className="inner">
          <div className="header-left">
            <h1>
              <Link to={"/"}>
                <img src="/images/header/logo-MatinKim-black.svg" alt="로고" />
              </Link>
            </h1>
            <nav>
              <ul className="main-menu">
                {topmenus.map((menu, id) => (
                  <li
                    key={id}
                    onMouseEnter={() =>
                      menu.key === "shop" && setIsShopHovered(true)
                    }
                    onMouseLeave={() =>
                      menu.key === "shop" && setIsShopHovered(false)
                    }
                  >
                    <Link to={`/${menu.key}`}>{menu.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="header-right">
            <ul className="gnb-list">
              <li>
                <input type="text" placeholder="SEARCH" />
              </li>
              <li className="cart">
                <button>
                  <img src="/images/header-icon/cart.svg" alt="" />
                  <span className="cart-num">
                    <span>1</span>
                  </span>
                </button>
              </li>
              <li className="member">
                <button onClick={() => setLoginOpen(true)}>
                  <img src="/images/header-icon/user.svg" alt="" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`header-active ${isShopHovered ? "active" : ""}`}
          onMouseEnter={() => setIsShopHovered(true)}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          <div className="inner">
            <div className="header-active-left">
              <ul className="default-menu">
                {defaultMenus.map((m, id) => (
                  <li key={id}>
                    <Link to={m.link}>{m.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="header-active-middle">
              <ul className="main-menu">
                {menus.map((menu, id) => (
                  <li key={id}>
                    {menu.name}
                    <ul className="sub-menu">
                      {menu.subMenu.map((m, id) => (
                        <li key={id}>
                          <Link to={m.link}>
                            <p>{m.name}</p>
                            <p className="e-sub-menu">{m.subName}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className="header-active-right">
              {photoMenu.map((m, id) => (
                <Link key={id}>
                  <div className="img-box">
                    <img src={m.src} alt="" />
                  </div>
                  <div className="text-box">
                    <p>{m.subtitle}</p>
                    <h3>{m.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isLoginOpen && <Login onClose={() => setLoginOpen()} />}
    </header>
  );
}
