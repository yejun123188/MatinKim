import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./scss/Header.scss";
import { useProductStore } from "../store/useProductStore";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import { useAuthStore } from "../store/useAuthStore";
import { useLoginStore } from "../store/useLoginStore";

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
    src: "/images/collection/jeno/img_jeno_00019.jpg",
    subtitle: "MATIN KIM X NCT JENO",
    title: "No Rush",
    link: "/collections/1",
  },
  {
    src: "/images/collection/liz/img_liz_00022.jpg",
    subtitle: "MATIN KIM X LIZ",
    title: "HOUSE, HAUS!",
    link: "/collections/3",
  },
  {
    src: "/images/collection/liz/img_liz_00019.jpg",
    subtitle: "Matin Kim MAGAZINE",
    title: "BUCKET LIST",
    link: "/collections/4",
  },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const { menus, cartCount, isCartOpen, openCart, closeCart } =
    useProductStore();

  const { user, onLogout } = useAuthStore();
  const { isLoginOpen, openLogin, closeLogin } = useLoginStore();

  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleAuthButtonClick = async () => {
    if (user) {
      await onLogout();
      navigate("/");
    } else {
      openLogin();
    }
  };

  const handleTopMenuEnter = (key) => {
    if (key === "shop") {
      setIsShopHovered(true);
    } else {
      setIsShopHovered(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCartOpen || isLoginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isLoginOpen]);

  return (
    <>
      <header>
        {isHome && !isScrolled && (
          <div className="top-banner">
            <Link to="/">1ST SPRING 2026</Link>
          </div>
        )}

        <div
          className={`header-wrapper ${isHome ? "home" : "subpage"} ${
            isScrolled ? "scrolled" : ""
          } ${!isHome || isScrolled ? "no-banner" : ""}`}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          <div
            className={`header-show ${isHome ? "home" : "subpage"} ${
              isScrolled ? "scrolled" : ""
            } ${!isHome || isScrolled ? "no-banner" : ""}`}
          >
            <div className="inner">
              <div className="header-left">
                <h1>
                  <Link to="/" onClick={() => setIsShopHovered(false)}>
                    <img
                      src="/images/header/logo-MatinKim-black.svg"
                      alt="로고"
                    />
                  </Link>
                </h1>

                <nav>
                  <ul>
                    {topmenus.map((menu) => (
                      <li
                        key={menu.key}
                        onMouseEnter={() => handleTopMenuEnter(menu.key)}
                      >
                        <Link
                          to={menu.key === "shop" ? "/all" : `/${menu.key}`}
                          onClick={() => setIsShopHovered(false)}
                        >
                          {menu.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="header-right">
                <ul className="gnb-list">
                  <li className="header-cart">
                    <button type="button" onClick={openCart}>
                      <img src="/images/header-icon/cart.svg" alt="장바구니" />
                      {cartCount > 0 && (
                        <span className="cart-num">
                          <span>{cartCount}</span>
                        </span>
                      )}
                    </button>
                  </li>

                  <li className="member">
                    {user ? (
                      <Link to="/userInfo">
                        <img
                          src="/images/header-icon/user.svg"
                          alt="회원정보"
                        />
                      </Link>
                    ) : (
                      <button type="button" onClick={openLogin}>
                        <img src="/images/header-icon/user.svg" alt="로그인" />
                      </button>
                    )}
                  </li>

                  <li className="auth-action">
                    <button type="button" onClick={handleAuthButtonClick}>
                      <img
                        src={
                          user
                            ? "/images/header/logout.svg"
                            : "/images/header/login.svg"
                        }
                        alt={user ? "로그아웃" : "로그인"}
                      />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`header-active ${isShopHovered ? "active" : ""}`}
            onMouseEnter={() => setIsShopHovered(true)}
            onClick={() => setIsShopHovered(false)}
          >
            <div className="inner">
              <div className="header-active-left">
                <ul className="default-menu">
                  {defaultMenus.map((m, id) => (
                    <li key={id}>
                      <Link to={m.link}>
                        {m.name}
                        <img src="/images/header/move-arrow-icon.svg" alt="" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="header-active-middle">
                <ul className="main-menu">
                  {menus.map((menu, id) => (
                    <li key={id}>
                      <Link to={menu.link}>
                        {menu.name}
                        <img src="/images/header/move-arrow-icon.svg" alt="" />
                      </Link>

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
                  <Link key={id} to={m.link}>
                    <div className="img-box">
                      <img src={m.src} alt="" />
                      <div className="text-box">
                        <p>{m.subtitle}</p>
                        <h3>{m.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isLoginOpen && <Login onClose={closeLogin} />}
      {isCartOpen && <Cart onClose={closeCart} />}
    </>
  );
}
