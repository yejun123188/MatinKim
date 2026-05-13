import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, useBrandStore } from "../store/useBrandStore";
import "./scss/footer.scss";

const kimFooterMenus = [
  {
    title: "Help",
    links: [
      { label: "FAQ", path: "/kimmatin/faq" },
      { label: "Q&A", path: "/kimmatin/qna" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Guide", path: "/kimmatin/guide" },
      { label: "Privacy Policy", path: "/kimmatin/privacy-policy" },
      { label: "T&C", path: "/kimmatin/terms" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "BRAND", path: "/kimmatin/about/brand" },
      { label: "STOCKIST", path: "/kimmatin/about/stockist" },
      { label: "CONTACT", path: "/kimmatin/about/contact" },
    ],
  },
];

export default function Footer() {
  const { brand } = useBrandStore();
  const isKimMatin = brand === BRAND.KIMMATIN;
  const [openMenu, setOpenMenu] = useState(null);

  if (isKimMatin) {
    return (
      <footer className="footer kimmatin-footer">
        <div className="inner">
          <div className="footer-top">
            <h2 className="footer-logo">
              <img src="/images/footer-icon/logo-KIMMATIN.svg" alt="KIMMATIN" />
            </h2>
            <p className="footer-slogan">
              KIMMATIN, an upscale collection from Matin Kim, merges modern
              <br />
              tailoring with a distinctive roughness. It strikes a balance
            </p>
          </div>

          <div className="footer-bottom">
            <div className="footer-left">
              <ul className="kimmatin-footer-menu">
                {kimFooterMenus.map((menu) => (
                  <li key={menu.title} className="kimmatin-footer-menu-item">
                    <button
                      type="button"
                      className={openMenu === menu.title ? "is-open" : ""}
                      onClick={() =>
                        setOpenMenu(openMenu === menu.title ? null : menu.title)
                      }
                    >
                      <span>{menu.title}</span>
                      <span
                        className="footer-dropdown-icon"
                        aria-hidden="true"
                      />
                    </button>

                    {openMenu === menu.title && (
                      <ul className="kimmatin-footer-dropdown">
                        {menu.links.map((link) => (
                          <li key={link.path}>
                            <Link to={link.path}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <address className="footer-address">
                <p>MATIN KIM / Business Contact : matinkimcrew@matinkim.com</p>
              </address>

              <p className="copyright">MATINKIM All Rights Reserved</p>
            </div>

            <div className="footer-right">
              <ul className="sns-list">
                <li>
                  <Link
                    to="https://www.instagram.com/kimmatin_magazine/"
                    aria-label="Instagram"
                  >
                    <img
                      src="/images/footer-icon/imstagram-icon.svg"
                      alt="Instagram"
                    />
                  </Link>
                </li>

              </ul>

              <div className="customer-center">

              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="inner">
        <div className="footer-top">
          <h2 className="footer-logo">
            <img src="/images/footer-icon/logo-name.svg" alt="logo" />
          </h2>
          <p className="footer-slogan">
            Matin Kim Strives To Harmonize A Distinctive Sense Of Freedom And A
            Rough Style
            <br />
            Within The Diverse Tapestry Of Daily Fashion Cultures.
          </p>
        </div>

        <div className="footer-bottom">
          <div className="footer-left">
            <ul className="footer-menu">
              <li>
                <Link to="/">MATIN KIM</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/agreement">T&C</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/guide">Guide</Link>
              </li>
              <li>
                <Link to="/product-authentication">Authenticity</Link>
              </li>
            </ul>

            <address className="footer-address">
              <p>MATIN KIM / Business Contact : matinkimcrew@matinkim.com</p>
            </address>

            <p className="copyright">MATINKIM All Rights Reserved</p>
          </div>

          <div className="footer-right">
            <ul className="sns-list">
              <li>
                <Link
                  to="https://www.instagram.com/matinkim_magazine/?hl=ko"
                  aria-label="Instagram"
                >
                  <img
                    src="/images/footer-icon/imstagram-icon.svg"
                    alt="Instagram"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.youtube.com/@MATINKIM-is2dm"
                  aria-label="YouTube"
                >
                  <img
                    src="/images/footer-icon/youtube-logo.svg"
                    alt="YouTube"
                  />
                </Link>
              </li>
            </ul>

            <div className="customer-center">
              <div className="custom-link">
                <Link to="/qna">
                  <strong>Customer Center</strong>
                  <img src="/images/footer-icon/Vector.svg" alt="" />
                </Link>
              </div>
              <p>09:30 - 18:00 / Weekend and holidays off</p>
              <span>1877-8170</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
