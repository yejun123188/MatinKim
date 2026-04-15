import { Link } from "react-router-dom";
import "./scss/footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="inner">
        {/* <!-- 상단 중앙 브랜드 영역 --> */}
        <div className="footer-top">
          <h2 className="footer-logo">
            <img src="./images/footer-icon/logo-name.svg" alt="logo" />
          </h2>
          <p className="footer-slogan">
            Matin Kim Strives To Harmonize A Distinctive Sense Of Freedom And A Rough Style<br />
            Within The Diverse Tapestry Of Daily Fashion Cultures.
          </p>
        </div>

        {/* <!-- 하단 정보 영역 --> */}
        <div className="footer-bottom">
          <div className="footer-left">
            <ul className="footer-menu">
              <li><a href="#">(주)마뗑킴</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
              <li><a href="#">이용안내</a></li>
              <li><a href="#">고객센터</a></li>
              <li><a href="#">채용인증</a></li>
            </ul>

            <address className="footer-address">
              <p>(주)마뗑킴 | 대표이사 : 홍길동 / 경기 성남시 분당구 판교로 242 더샵 702호 / 통신판매업신고번호 : 2025-성남분당A-0780</p>
              <p>사업자등록번호 : 743-88-00954 <a href="#">[사업자정보확인]</a> / 개인정보보호책임자 : 이지은</p>
              <p>비즈니스 관련문의 : matinkimcrew@matinkim.com</p>
            </address>

            <p className="copyright">Ⓒ MATINKIM All Rights Reserved</p>
          </div>

          <div className="footer-right">
            <ul className="sns-list">
              <li>
                <a href="https://www.instagram.com/matinkim_magazine/?hl=ko" aria-label="인스타그램">
                  <img src="./images/footer-icon/imstagram-icon.svg" alt="인스타그램" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@%EA%B9%80%EB%8B%A4%EC%9D%B8%EC%9D%98%EC%A0%84%EB%B6%80%EB%8B%A4%EC%9D%B8/videos" aria-label="유튜브">
                  <img src="./images/footer-icon/youtube-logo.svg" alt="유튜브" />
                </a>
              </li>
            </ul>

            <div className="customer-center">
              <div className="custom-link">
                <Link to="#">
                  <strong>고객센터</strong>
                  <img src="/images/footer-icon/Vector.svg" alt="화살표" />
                </Link>
              </div>
              <p>문의시간 : 09:30 ~ 18:00 / 주말·공휴일 휴무</p>
              <span>1877-8170</span>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}
