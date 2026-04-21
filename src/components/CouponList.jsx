import React from "react";
import "./scss/CouponList.scss"
export default function CouponList() {
  return (
    <div className="couponlist-wrap">
      <div className="coupon-top">
        <input type="text" placeholder="쿠폰번호 등록" />
        <button>쿠폰번호 인증</button>
        <p>• 반드시 쇼핑몰에서 발행한 쿠폰번호만 입력해주세요.(10~35자 일련번호 "-" 제외)</p>
        <ul className="explain-list">
          <li>•쿠폰인증번호 등록하기에서 쇼핑몰에서 발행한 종이쿠폰/시리얼쿠폰/모바일쿠폰 등의 인증번호를 등록하시면 온라인쿠폰으로 발급되어 사용이 가능합니다.</li>
          <li>•쿠폰은 주문 시 1회에 한해 적용되며, 1회 사용 시 재 사용이 불가능합니다.</li>
          <li>•쿠폰은 적용 가능한 상품이 따로 적용되어 있는 경우 해당 상품 구매 시에만 사용이 가능합니다.</li>
          <li>•특정한 종이쿠폰/시리얼쿠폰/모바일쿠폰의 경우 단 1회만 사용이 가능할 수 있습니다.</li>
        </ul>
      </div>
      <div className="coupon-bottom">
        <div className="mycoupon-top">
          <p className="mycoupon-title">내 쿠폰</p>
          <p className="count-coupon">1 개</p>
        </div>
        <table>
          <tr>
            <th>번호</th><th>쿠폰명</th><th>쿠폰혜택</th>
            <th>사용 가능 기간</th><th>쿠폰적용 상품</th>
            <th>구매금액</th><th>결제 수단</th>
          </tr>
          <tr>
            <td>1</td>  <td>1</td>  <td>1</td>  <td>1</td>  <td>1</td>  <td>1</td>  <td>1</td>
          </tr>
        </table>
      </div>

    </div>
  )
}
