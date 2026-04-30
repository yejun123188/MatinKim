import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "./scss/UserAccountEdit.scss";

const splitPhone = (phone = "") => {
  const [phone1 = "010", phone2 = "", phone3 = ""] = phone.split("-");
  return { phone1, phone2, phone3 };
};

const splitBirth = (birth = "") => {
  const [birthYear = "", birthMonth = "", birthDay = ""] = birth.split("-");
  return { birthYear, birthMonth, birthDay };
};

const createInitialForm = (user) => ({
  userId: user.userId || user.email?.split("@")[0] || "",
  password: "",
  passwordConfirm: "",
  name: user.name || user.nickname || user.displayName || "",
  zipcode: user.zipcode || "",
  address: user.address || "",
  detailAddress: user.detailAddress || "",
  phone1: splitPhone(user.phone || user.phoneNumber).phone1,
  phone2: splitPhone(user.phone || user.phoneNumber).phone2,
  phone3: splitPhone(user.phone || user.phoneNumber).phone3,
  email: user.email || "",
  birthYear: splitBirth(user.birth).birthYear,
  birthMonth: splitBirth(user.birth).birthMonth,
  birthDay: splitBirth(user.birth).birthDay,
  calendarType: user.calendarType || "solar",
});

function UserAccountEditForm({ user, openPostcode, onUpdateUserInfo }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ...createInitialForm(user),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handlePostcode = () => {
    openPostcode(({ zipcode, address }) => {
      setForm((prev) => ({
        ...prev,
        zipcode,
        address,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      userId: !form.userId.trim(),
      password: !form.password.trim(),
      passwordConfirm: !form.passwordConfirm.trim(),
      name: !form.name.trim(),
      phone2: !form.phone2.trim(),
      phone3: !form.phone3.trim(),
      email: !form.email.trim(),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      alert("주소와 생년월일을 제외한 필수 항목을 모두 입력해주세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        password: true,
        passwordConfirm: true,
      }));
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    await onUpdateUserInfo({
      userId: form.userId,
      name: form.name,
      zipcode: form.zipcode,
      address: form.address,
      detailAddress: form.detailAddress,
      phone: `${form.phone1}-${form.phone2}-${form.phone3}`,
      email: form.email,
      birth: `${form.birthYear}-${form.birthMonth}-${form.birthDay}`,
      calendarType: form.calendarType,
    });
  };

  return (
    <form className="account-edit" onSubmit={handleSubmit}>
      <div className="account-edit-panel">
        <div className="account-edit-column">
          <label className="form-field">
            <span>아이디*</span>
            <input
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className={errors.userId ? "error" : ""}
            />
          </label>

          <label className="form-field">
            <span>비밀번호*</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            <em>(영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자)</em>
          </label>

          <label className="form-field">
            <span>비밀번호 확인*</span>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={errors.passwordConfirm ? "error" : ""}
            />
          </label>

          <label className="form-field">
            <span>이름*</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
          </label>
        </div>

        <div className="account-edit-column">
          <div className="form-field">
            <span>주소</span>
            <div className="address-row">
              <input
                type="text"
                name="zipcode"
                placeholder="우편번호"
                value={form.zipcode}
                readOnly
              />
              <button type="button" onClick={handlePostcode}>
                주소검색
              </button>
            </div>
            <input
              type="text"
              name="address"
              placeholder="기본주소"
              value={form.address}
              readOnly
            />
            <input
              type="text"
              name="detailAddress"
              placeholder="나머지 주소 (선택 입력 가능)"
              value={form.detailAddress}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span>휴대전화*</span>
            <div className="phone-row">
              <select name="phone1" value={form.phone1} onChange={handleChange}>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span>-</span>
              <input
                type="text"
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                maxLength={4}
                className={errors.phone2 ? "error" : ""}
              />
              <span>-</span>
              <input
                type="text"
                name="phone3"
                value={form.phone3}
                onChange={handleChange}
                maxLength={4}
                className={errors.phone3 ? "error" : ""}
              />
              <button type="button">인증번호 받기</button>
            </div>
          </div>

          <label className="form-field">
            <span>이메일*</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
          </label>

          <div className="form-field">
            <span>생년월일</span>
            <div className="birth-row">
              <input
                type="text"
                name="birthYear"
                value={form.birthYear}
                onChange={handleChange}
                maxLength={4}
              />
              <span>/</span>
              <input
                type="text"
                name="birthMonth"
                value={form.birthMonth}
                onChange={handleChange}
                maxLength={2}
              />
              <span>/</span>
              <input
                type="text"
                name="birthDay"
                value={form.birthDay}
                onChange={handleChange}
                maxLength={2}
              />

              <label>
                <input
                  type="radio"
                  name="calendarType"
                  value="solar"
                  checked={form.calendarType === "solar"}
                  onChange={handleChange}
                />
                양력
              </label>
              <label>
                <input
                  type="radio"
                  name="calendarType"
                  value="lunar"
                  checked={form.calendarType === "lunar"}
                  onChange={handleChange}
                />
                음력
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="account-edit-buttons">
        <button type="button" className="withdraw">
          회원탈퇴
        </button>
        <button type="submit" className="submit">
          회원정보 수정
        </button>
        <button
          type="button"
          className="cancel"
          onClick={() => navigate("/userInfo")}
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default function UserAccountEdit() {
  const { user, openPostcode, onUpdateUserInfo } = useAuthStore();

  if (!user)
    return <div className="account-edit-empty">로그인이 필요합니다.</div>;

  return (
    <UserAccountEditForm
      key={user.uid}
      user={user}
      openPostcode={openPostcode}
      onUpdateUserInfo={onUpdateUserInfo}
    />
  );
}
