import React from "react";
import "./scss/Login.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="login-box">
          <div className="login-top">
            <h2>Log In</h2>
            <button
              className="close-btn"
              aria-label="닫기"
              onClick={handleClose}
            >
              <img src="/images/sub-login/x-icon.png" alt="닫기" />
            </button>
          </div>

          <form>
            <div className="input-wrap error">
              <input type="text" placeholder="아이디*" />
              {/* <p className="error-text">아이디 항목은 필수 입력값입니다.</p> */}
            </div>

            <div className="input-wrap">
              <input type="password" placeholder="비밀번호*" />
            </div>

            <label className="save-id">
              <input type="checkbox" />
              <span>아이디 저장</span>
            </label>

            <button type="submit" className="login-btn">
              로그인하기
            </button>

            <div className="login-links">
              <a href="#!">아이디 찾기</a>
              <span>|</span>
              <a href="#!">비밀번호 재설정</a>
            </div>

            <div className="sns-login">
              <button type="button" className="kakao">
                <img src="./images/sub-login/kakao-icon.svg" alt="Kakao" />
                <span>카카오로 시작하기</span>
              </button>
              <button type="button" className="naver">
                <img src="./images/sub-login/naver-icon.svg" alt="Naver" />
                <span>네이버로 시작하기</span>
              </button>
              <button type="button" className="google">
                <img src="./images/sub-login/google-icon.svg" alt="Google" />
                <span>Google로 로그인</span>
              </button>
            </div>

            <Link to="/member" className="join-btn">
              회원가입 후 혜택받기
            </Link>

            <Link to="/" className="guest-order">
              비회원 주문 조회하기
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}