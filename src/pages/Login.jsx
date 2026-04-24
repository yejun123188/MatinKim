import React, { useState } from "react";
import "./scss/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login({ onClose }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [errors, setErrors] = useState({
    userId: false,
    password: false,
  });

  const { onLoginByUserId, onGoogleLogin } = useAuthStore();
  const navigate = useNavigate();

  //아이디
  const handleBlurUserId = () => {
    setErrors((prev) => ({
      ...prev,
      userId: !userId.trim()
    }));
  };

  // 비밀번호
  const handleBlurPassword = () => {
    setErrors((prev) => ({
      ...prev,
      password: !password.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      userId: !userId.trim(),
      password: !password.trim(),
    };

    setErrors(newErrors);

    if (newErrors.userId || newErrors.password) return;

    try {
      await onLoginByUserId(userId, password);
      navigate("/");
      onClose?.();
    } catch (error) {
      console.error("아이디 로그인 실패:", error);
      alert(error.code || error.message || "로그인에 실패했습니다.");
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);

      await onGoogleLogin();
      navigate("/");
      onClose?.();
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert(error.code || error.message || "구글 로그인에 실패했습니다.");
    } finally {
      setGoogleLoading(false);
    }
  };
  const { onKakaoLogin } = useAuthStore();
  // 카카오 로그인
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 시도")
    onKakaoLogin();

  }

  return (
    <div className="login-page">
      <div className="login-dim" onClick={onClose}></div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-top">
            <h2>Log In</h2>
            <button
              type="button"
              className="close-btn"
              aria-label="닫기"
              onClick={onClose}
            >
              <img src="/images/sub-login/x-icon.svg" alt="닫기" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <div className={`input-wrap ${errors.userId ? "error" : ""}`}>
              <input
                type="text"
                placeholder="아이디"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setErrors((prev) => ({ ...prev, userId: false }));
                }}
                onBlur={handleBlurUserId}
              />
              {errors.userId && (
                <p className="error-text"><img src="/images/sub-login/error-icon.svg" alt="에러" />아이디 항목은 필수 입력값입니다.</p>
              )}
            </div>

            <div className={`input-wrap ${errors.password ? "error" : ""}`}>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: false }));
                }}
                onBlur={handleBlurPassword}
              />
              {errors.password && (
                <p className="error-text"><img src="/images/sub-login/error-icon.svg" alt="에러" />패스워드 항목은 필수 입력값입니다.</p>
              )}
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
              <button type="button" className="kakao" onClick={onKakaoLogin}>
                <img src="/images/sub-login/kakao-icon.svg" alt="Kakao" />
                <span>카카오로 시작하기</span>
              </button>

              <button type="button" className="naver">
                <img src="/images/sub-login/naver-icon.svg" alt="Naver" />
                <span>네이버로 시작하기</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="google"
                disabled={googleLoading}
              >
                <img src="/images/sub-login/google-icon.svg" alt="Google" />
                <span>{googleLoading ? "로그인 중..." : "Google로 로그인"}</span>
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