import React, { useState } from "react";
import "./scss/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';

export default function Login({ onClose }) {


  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);


  const { onLogin, onGoogleLogin } = useAuthStore();


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onLogin(email, password);
      navigate("/");
      onClose?.();
    } catch (error) {
      console.error("이메일 로그인 실패:", error);
      alert(error.code || error.message);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      console.log("구글 로그인 시작");

      const user = await onGoogleLogin();
      console.log("구글 로그인 성공:", user);

      navigate("/");
      onClose?.();
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert(error.code || error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page" >

      <div className="login-dim" onClick={onClose}></div>
      <div className="login-right">

        <div className="login-box">
          <div className="login-top">
            <h2>Log In</h2>
            <button
              className="close-btn"
              aria-label="닫기"
              onClick={onClose} >
              <img src="/images/sub-login/x-icon.svg" alt="닫기" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-wrap error">
              <input
                type="text"
                placeholder="아이디*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <p className="error-text">아이디 항목은 필수 입력값입니다.</p> */}
            </div>

            <div className="input-wrap">
              <input
                type="password"
                placeholder="비밀번호*"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
              />
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
                <img src="/images/sub-login/kakao-icon.svg" alt="Kakao" />
                <span>카카오로 시작하기</span>
              </button>
              <button type="button" className="naver">
                <img src="/images/sub-login/naver-icon.svg" alt="Naver" />
                <span>네이버로 시작하기</span>
              </button>
              <button type="button" onClick={handleGoogleLogin} className="google"
                disabled={googleLoading}>
                <img src="/images/sub-login/google-icon.svg" alt="Google" />
                <span>Google로 로그인</span>
              </button>
            </div>

            <Link to="/signup" className="join-btn" onClick={onClose}>
              회원가입 후 혜택받기
            </Link>

            <Link to="/guest-order" className="guest-order" onClick={onClose}>
              비회원 주문 조회하기
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}