import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import "./scss/WishList.scss";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";
import UserInfoNone from "./UserInfoNone";

const formatPrice = (price) => `₩ ${Number(price || 0).toLocaleString()}`;

const formatCount = (count) => `${Number(count || 1).toLocaleString()}개`;

export default function WishList() {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const { wishList, onRemoveWish, onLoadWishList, onAddCart } =
    useProductStore();

  const [checkedKeys, setCheckedKeys] = useState([]);

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user]);

  // 삭제된 상품 체크목록 제거
  useEffect(() => {
    const validKeys = wishList.map((p) => p.key);

    setCheckedKeys((prev) => prev.filter((k) => validKeys.includes(k)));
  }, [wishList]);

  // 품절 아래 정렬
  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0),
  );

  // 전체선택 여부
  const isAllChecked =
    sortedWishList.length > 0 &&
    sortedWishList.every((p) => checkedKeys.includes(p.key));

  // 전체선택
  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setCheckedKeys(sortedWishList.map((p) => p.key));
    } else {
      setCheckedKeys([]);
    }
  };

  // 개별선택
  const handleItemCheck = (key) => {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // 삭제
  const handleRemove = async (product) => {
    await onRemoveWish(product.key, user.uid);
  };

  // 선택삭제
  const handleSelectedDelete = async () => {
    if (checkedKeys.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    const targets = wishList.filter((p) => checkedKeys.includes(p.key));

    for (const p of targets) {
      await onRemoveWish(p.key, user.uid);
    }

    setCheckedKeys([]);
  };

  // 선택주문
  const handleSelectedOrder = () => {
    if (checkedKeys.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    const targets = wishList.filter((p) => checkedKeys.includes(p.key));

    const soldOutItems = targets.filter((p) => Boolean(p.isSoldOut));

    if (soldOutItems.length > 0) {
      const names = soldOutItems.map((p) => p.name).join(", ");

      alert(`아래 품절 상품은 주문이 불가합니다:\n${names}`);

      return;
    }

    alert(`${targets.length}개 상품 주문 진행`);
  };

  // 비로그인
  if (!user) {
    return (
      <div className="wishlist-wrap">
        <div className="middle">
          <p className="empty">로그인 후 이용 가능합니다.</p>

          <button className="Bbtn" onClick={() => navigate("/login")}>
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wishlist-wrap">
        <div className="middle">
          <div className="top">
            <label>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleAllCheck}
              />
              전체선택
            </label>
          </div>

          <ul className="wish-list">
            {wishList.length === 0 && (
              <li className="empty">
                <UserInfoNone title="상품" />
              </li>
            )}

            {sortedWishList.map((product) => {
              const isSoldOut = Boolean(product.isSoldOut);

              return (
                <li
                  key={product.key}
                  className={`items ${isSoldOut ? "is-soldout" : ""}`}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={checkedKeys.includes(product.key)}
                      onChange={() => handleItemCheck(product.key)}
                    />
                  </div>

                  <div
                    className="img-box"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <img src={product.mainImg} alt={product.name} />
                  </div>

                  <div>
                    <div className="text-box">
                      <p
                        className="title"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name}
                      </p>

                      {product.discountRate > 0 ? (
                        <div className="price-box">
                          <strong className="discount-price">
                            {formatPrice(product.discountPrice)}
                          </strong>

                          <span className="price">
                            {formatPrice(product.price)}
                          </span>

                          <span className="discount-rate">
                            {product.discountRate}%
                          </span>
                        </div>
                      ) : (
                        <strong className="price2">
                          {formatPrice(product.price)}
                        </strong>
                      )}
                    </div>

                    {!isSoldOut && (
                      <div className="option-box">
                        <p className="option">
                          {product.selectedSize || "-"}
                          {" / "}
                          {formatCount(product.quantity)}
                        </p>
                      </div>
                    )}

                    {isSoldOut && (
                      <span className="soldout-badge">SOLD OUT</span>
                    )}

                    <div className="button-box">
                      {!isSoldOut && (
                        <>
                          <button
                            className="Bbtn"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            바로구매
                          </button>

                          <button
                            className="Wbtn"
                            onClick={() => {
                              const item = {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                discountPrice: product.discountPrice,
                                discountRate: product.discountRate,
                                mainImg: product.mainImg,
                                hoverImg: product.hoverImg,
                                image: product.mainImg || product.hoverImg,
                                key: `${product.id}-${product.selectedSize}-${product.selectedColor}`,
                              };

                              setCartItem(product);

                              setShowCartPopup(true);

                              onAddCart({
                                ...item,
                                size: product.selectedSize,
                                color: product.selectedColor,
                                count: product.quantity,
                              });
                            }}
                          >
                            장바구니
                          </button>
                        </>
                      )}

                      <button
                        className="Wbtn"
                        onClick={() => handleRemove(product)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="wishlist-bottom">
        <div className="bottom-button-box">
          <button className="Bbtn" onClick={handleSelectedOrder}>
            선택상품주문
          </button>

          <button className="Wbtn" onClick={handleSelectedDelete}>
            선택삭제
          </button>
        </div>
      </div>

      {showCartPopup && (
        <CartPopup
          mode="best"
          product={cartItem}
          selectedColor={cartItem?.selectedColor}
          selectedSize={cartItem?.selectedSize}
          quantity={cartItem?.quantity}
          onClose={() => setShowCartPopup(false)}
          onGoCart={() => {
            setShowCartPopup(false);
            setShowCart(true);
          }}
        />
      )}

      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  );
}
