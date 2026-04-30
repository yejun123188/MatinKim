import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import "./scss/CouponList.scss";

export default function CouponList() {
  const { user, couponList, onFetchCoupons, onAddCoupon } = useAuthStore();
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (!user) return;
    onFetchCoupons();
  }, [user, onFetchCoupons]);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    const isSuccess = await onAddCoupon(couponCode);
    if (isSuccess) setCouponCode("");
  };

  return (
    <div className="couponlist-wrap">
      <div className="coupon-top">
        <form className="coupon-num" onSubmit={handleAddCoupon}>
          <input
            type="text"
            placeholder="쿠폰번호 등록"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button type="submit">
            쿠폰번호 인증
          </button>
        </form>
        <p>
          • 반드시 쇼핑몰에서 발행한 쿠폰번호만 입력해주세요.(10~35자 일련번호
          "-" 제외)
        </p>
        <ul className="explain-list">
          <li>
            • 쿠폰인증번호 등록하기에서 쇼핑몰에서 발행한
            종이쿠폰/시리얼쿠폰/모바일쿠폰 등의 인증번호를 등록하시면
            온라인쿠폰으로 발급되어 사용이 가능합니다.
          </li>
          <li>
            • 쿠폰은 주문 시 1회에 한해 적용되며, 1회 사용 시 재 사용이
            불가능합니다.
          </li>
          <li>
            • 쿠폰은 적용 가능한 상품이 따로 적용되어 있는 경우 해당 상품 구매
            시에만 사용이 가능합니다.
          </li>
          <li>
            • 특정한 종이쿠폰/시리얼쿠폰/모바일쿠폰의 경우 단 1회만 사용이
            가능할 수 있습니다.
          </li>
        </ul>
      </div>
      <div className="coupon-bottom">
        <div className="mycoupon-top">
          <p className="mycoupon-title">내 쿠폰</p>
          <p className="count-coupon">{couponList.length} 개</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>쿠폰명</th>
              <th>쿠폰혜택</th>
              <th>사용 가능 기간</th>
              <th>쿠폰적용 상품</th>
              <th>구매금액</th>
              <th>결제 수단</th>
            </tr>
          </thead>
          <tbody>
            {couponList.length > 0 ? (
              couponList.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.couponName}</td>
                  <td>{coupon.benefit}</td>
                  <td>{coupon.period}</td>
                  <td>{coupon.applyProduct}</td>
                  <td>{coupon.minPrice}</td>
                  <td>{coupon.payment}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-coupon">
                  쿠폰 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
