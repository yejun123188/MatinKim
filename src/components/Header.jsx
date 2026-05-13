import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./scss/Header.scss";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "./ProductCard";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import { useAuthStore } from "../store/useAuthStore";
import { useLoginStore } from "../store/useLoginStore";
import { BRAND, useBrandStore } from "../store/useBrandStore";
import products2 from "../data/products2.json";
import { buildProductMenus } from "../utils/productMenu";


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

const popularKeywords = [
  "볼캡",
  "가디건",
  "청바지",
  "크로스백",
  "반팔티",
  "후드집업",
  "카고팬츠",
  "비니",
  "스커트",
  "바람막이",
];

const bestTabs = ["ALL", "CLOTHING", "GOODS", "ACCESSORIES"];
const kimMatinMenus = [
  { key: "shop", label: "SHOP", link: "/all" },
  { key: "archive", label: "ARCHIVE", link: "/kimmatin/archive" },
  { key: "about", label: "ABOUT", link: "/kimmatin/about" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { brand } = useBrandStore();
  const isKimMatin = brand === BRAND.KIMMATIN;

  const isHome = location.pathname === "/";

  const { menus, cartCount, isCartOpen, openCart, closeCart, items, BestItems, onFetchItem, onBestMenus } =
    useProductStore();

  const { user, onLogout } = useAuthStore();
  const { isLoginOpen, openLogin, closeLogin, guestMode, guestOrderItems } = useLoginStore();

  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [activeBestTab, setActiveBestTab] = useState("ALL");
  const searchInputRef = useRef(null);
  const isHomeIdle = isHome && !isScrolled && !isShopHovered;
  const kimMatinShopMenus = useMemo(() => buildProductMenus(products2), []);
  const headerShopMenus = isKimMatin ? kimMatinShopMenus : menus;

  const searchBestItems = useMemo(() => {
    const kimBestItems = products2.filter(
      (item) => Array.isArray(item.tag) && item.tag.includes("MUST HAVE"),
    );
    const sourceItems = isKimMatin
      ? kimBestItems
      : BestItems.length > 0
        ? BestItems
        : items.filter((item) => Array.isArray(item.tag) && item.tag.includes("MUST HAVE"));

    const filteredItems = sourceItems.filter((item) => {
      if (activeBestTab === "ALL") return true;
      return item.category1 === activeBestTab;
    });

    const displayItems = filteredItems.length > 0 ? filteredItems : sourceItems;

    if (activeBestTab === "ALL", "CLOTHING", "GOODS", "ACCESSORIES") {
      const shuffled = [...displayItems].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(shuffled.length, 5));
    }

    return displayItems.length > 24 ? displayItems.slice(24, 29) : displayItems.slice(0, 5);
  }, [BestItems, items, activeBestTab, isKimMatin]);

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

  const handleSearchClick = () => {
    setIsShopHovered(false);
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    const nextKeywords = recentKeywords.filter((keyword) => keyword !== keywordToRemove);
    setRecentKeywords(nextKeywords);
    localStorage.setItem("recentSearchKeywords", JSON.stringify(nextKeywords));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const keyword = searchWord.trim();
    if (!keyword) return;

    const nextKeywords = [
      keyword,
      ...recentKeywords.filter((recentKeyword) => recentKeyword !== keyword),
    ].slice(0, 5);

    setRecentKeywords(nextKeywords);
    localStorage.setItem("recentSearchKeywords", JSON.stringify(nextKeywords));
    setIsSearchOpen(false);
    setSearchWord('');
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
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
    if (isCartOpen || isLoginOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isLoginOpen, isSearchOpen]);

  useEffect(() => {
    try {
      const savedKeywords = JSON.parse(localStorage.getItem("recentSearchKeywords")) || [];
      setRecentKeywords(Array.isArray(savedKeywords) ? savedKeywords.slice(0, 5) : []);
    } catch {
      setRecentKeywords([]);
    }
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    onFetchItem();
    onBestMenus();
  }, [isSearchOpen, onFetchItem, onBestMenus]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  return (
    <>
      <header>
        {/* {isHome && !isScrolled && (
          <div className="top-banner">
            <Link to="/">1ST SPRING 2026</Link>
          </div>
        )} */}

        <div
          className={`header-wrapper ${isHome ? "home" : "subpage"} ${isScrolled ? "scrolled" : ""
            } ${!isHome || isScrolled ? "no-banner" : ""}`}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          <div
            className={`header-show ${isHome ? "home" : "subpage"} ${isScrolled ? "scrolled" : ""
              } ${isHomeIdle ? "home-idle" : ""
              } ${!isHome || isScrolled ? "no-banner" : ""} ${isKimMatin ? "kimmatin-header" : ""}`}
          >
            <div className="inner">
              <div className="header-left">
                <h1>
                  <Link to="/" onClick={() => setIsShopHovered(false)}>
                    <img
                      src={
                        isKimMatin
                          ? "/images/header/logo-KIMMATIN-white.svg"
                          : "/images/header/logo-MatinKim-black.svg"
                      }
                      alt="로고"
                    />
                  </Link>
                </h1>

                <nav>
                  <ul>
                    {(isKimMatin ? kimMatinMenus : topmenus).map((menu) => (
                      <li
                        key={menu.key}
                        onMouseEnter={() => handleTopMenuEnter(menu.key)}
                      >
                        <Link
                          to={menu.link || (menu.key === "shop" ? "/all" : `/${menu.key}`)}
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
                  <li className="header-search">
                    <button type="button" onClick={handleSearchClick}>
                      <img src="/images/icon/search-icon-black.svg" alt="검색" />
                    </button>
                  </li>

                  <li className="header-cart">
                    <button type="button" onClick={openCart}>
                      <img src="/images/icon/cart-icon-black.svg" alt="장바구니" />
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
                          src="/images/icon/user-icon-black.svg"
                          alt="회원정보"
                        />
                      </Link>
                    ) : (
                      <button type="button" onClick={openLogin}>
                        <img src="/images/icon/user-icon-black.svg" alt="로그인" />
                      </button>
                    )}
                  </li>

                  <li className="auth-action">
                    <button type="button" onClick={handleAuthButtonClick}>
                      <img
                        src={
                          user
                            ? "/images/icon/logout-icon-black.svg"
                            : "/images/icon/login-icon-black.svg"
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
            className={`header-active ${isShopHovered ? "active" : ""} ${isKimMatin ? "kimmatin-active" : ""}`}
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
                  {headerShopMenus.map((menu, id) => (
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
        <div
          className={`header-overlay ${isShopHovered ? "active" : ""}`}
          onMouseEnter={() => setIsShopHovered(false)}
        />
      </header>

      <div className={`search-drawer ${isSearchOpen ? "active" : ""} ${isKimMatin ? "kimmatin-search-drawer" : ""}`}>
        <button type="button" className="search-drawer-close" onClick={handleCloseSearch}>
          <img src="/images/icon/close-icon-black.svg" alt="검색창 닫기" />
        </button>

        <div className="search-drawer-inner">
          <form className="search-drawer-form" onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="검색어 입력"
              value={searchWord}
              onChange={(event) => setSearchWord(event.target.value)}
              aria-label="검색어 입력"
              autoFocus={isSearchOpen}
            />
            <button type="submit" aria-label="검색">
              <img src="/images/icon/search-icon-black.svg" alt="" aria-hidden="true" />
            </button>
          </form>

          <div className="search-keyword-area">
            <div>
              <h2>최근 검색어</h2>
              {recentKeywords.length > 0 ? (
                <ul className="recent-keyword-list">
                  {recentKeywords.map((keyword) => (
                    <li key={keyword}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchWord(keyword);
                          setIsSearchOpen(false);
                          navigate(`/search?q=${encodeURIComponent(keyword)}`);
                        }}
                      >
                        {keyword}
                      </button>
                      <button
                        type="button"
                        className="remove-keyword-btn"
                        onClick={() => handleRemoveKeyword(keyword)}
                        aria-label={`${keyword} 삭제`}
                      >
                        <img src="/images/icon/close-icon-black.svg" alt="삭제" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>최근 검색어가 없습니다</p>
              )}
            </div>

            <div>
              <h2>인기 검색어</h2>
              <ol className="popular-keyword-list">
                {popularKeywords.map((keyword, index) => (
                  <li key={keyword}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchWord(keyword);
                        setIsSearchOpen(false);
                        navigate(`/search?q=${encodeURIComponent(keyword)}`);
                      }}
                    >
                      <span>{index + 1}</span>
                      <strong>{keyword}</strong>
                      <em>NEW</em>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="search-best">
            <div className="search-best-head">
              <h2>이번주 베스트</h2>
              <div className="search-best-tabs">
                {bestTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={activeBestTab === tab ? "active" : ""}
                    onClick={() => setActiveBestTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <ul className="search-best-list">
              {searchBestItems.map((item) => (
                <ProductCard cate={item} key={item.id} onClick={handleCloseSearch} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`search-drawer-dim ${isSearchOpen ? "active" : ""} ${isKimMatin ? "kimmatin-search-dim" : ""}`}
        onClick={handleCloseSearch}
        aria-label="검색창 닫기"
      />

      {isLoginOpen && <Login onClose={closeLogin} />}
      {isCartOpen && <Cart onClose={closeCart} />}
    </>
  );
}
