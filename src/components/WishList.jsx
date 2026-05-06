import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import "./scss/WishList.scss";
import CartPopup from "../pages/CartPopup";
import Cart from "../pages/Cart";

const formatPrice = (price) => `₩ ${Number(price || 0).toLocaleString()}`;
const formatCount = (count) => `${Number(count || 1).toLocaleString()}개`;

export default function WishList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishList, onRemoveWish, onLoadWishList, onAddCart } =
    useProductStore();

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const handleRemove = async (product) => {
    await onRemoveWish(product.key, user.uid);
    alert("상품이 삭제되었습니다");
  };

  useEffect(() => {
    if (user?.uid) {
      onLoadWishList(user.uid);
    }
  }, [user, onLoadWishList]);

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

  const sortedWishList = [...wishList].sort(
    (a, b) => (a.isSoldOut ? 1 : 0) - (b.isSoldOut ? 1 : 0),
  );

  return (
    <>
      <div className="wishlist-wrap">
        <div className="middle">
          <div className="top">
            <label>
              <input type="checkbox" />
              전체선택
            </label>
          </div>

          <ul className="wish-list">
            {wishList.length === 0 && (
              <li className="empty">찜한 상품이 없습니다.</li>
            )}

            {sortedWishList.map((product) => {
              const isSoldOut = Boolean(product.isSoldOut);

              return (
                <li
                  key={product.key}
                  className={`items ${isSoldOut ? "is-soldout" : ""}`}
                >
                  <div>
                    <input type="checkbox" />
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
                          {product.selectedSize || "-"} /{" "}
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
          <button className="Bbtn">선택상품주문</button>
          <button className="Wbtn">선택삭제</button>
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
