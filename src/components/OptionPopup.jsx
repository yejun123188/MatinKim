import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import { useProductStore } from "../store/useProductStore";
import "./scss/optionPopup.scss";

const formatPrice = (price) => `₩ ${Number(price || 0).toLocaleString()}`;

export default function OptionPopup({ open, data, onClose }) {
  const navigate = useNavigate();
  const { onAddCart } = useProductStore();

  const productInfo = useMemo(() => {
    if (!data) return null;

    return (
      products.find(
        (product) =>
          String(product.id) === String(data.productId || data.id) ||
          product.name === data.name,
      ) || null
    );
  }, [data]);

  const sizeList = useMemo(() => {
    if (Array.isArray(productInfo?.sizes) && productInfo.sizes.length > 0) {
      return productInfo.sizes;
    }

    if (Array.isArray(data?.sizes) && data.sizes.length > 0) {
      return data.sizes;
    }

    return [data?.size || "FREE"];
  }, [data, productInfo]);

  const soldoutList = useMemo(
    () => productInfo?.soldout || data?.soldout || [],
    [data, productInfo],
  );
  const firstAvailableSize =
    sizeList.find((_, index) => !soldoutList[index]) || sizeList[0];

  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const nextSize =
      sizeList.includes(data?.size) && !soldoutList[sizeList.indexOf(data.size)]
        ? data.size
        : firstAvailableSize;

    setSelectedSize(nextSize);
    setQuantity(Number(data?.count || 1));
  }, [data, firstAvailableSize, sizeList, soldoutList]);

  if (!open || !data) return null;

  const image =
    data.img ||
    data.image ||
    data.mainImg ||
    data.hoverImg ||
    productInfo?.mainImg ||
    "";
  const price = Number(data.price || productInfo?.discountPrice || 0);
  const totalPrice = price * quantity;
  const selectedSoldOut = soldoutList[sizeList.indexOf(selectedSize)];

  const buildCartItem = () => ({
    id: productInfo?.id || data.productId || data.id,
    name: data.name,
    price,
    size: selectedSize,
    color: data.color || productInfo?.colors?.[0] || "",
    count: quantity,
    image,
    key: `${productInfo?.id || data.productId || data.id}-${selectedSize}-${
      data.color || productInfo?.colors?.[0] || ""
    }`,
  });

  const handleBuyNow = () => {
    if (selectedSoldOut) return;

    navigate("/payment", {
      state: {
        orderItems: [
          {
            id: productInfo?.id || data.productId || data.id,
            brand: "MATIN KIM",
            name: data.name,
            option: `${data.color || productInfo?.colors?.[0] || "-"} / ${selectedSize}`,
            quantity,
            price,
            image,
          },
        ],
      },
    });
    onClose();
  };

  const handleAddCart = () => {
    if (selectedSoldOut) return;

    onAddCart(buildCartItem());
    onClose();
  };

  return createPortal(
    <div className={`option-bg ${open ? "open" : "close"}`} onClick={onClose}>
      <div className="option-pop-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="op-check">
          <p>옵션선택</p>
          <img src="./images/closebtn.svg" alt="닫기" onClick={onClose} />
        </div>

        <p className="op-name">{data.name}</p>

        <div className="op-box op-size">
          <p className="op-title">SIZE</p>
          <div className="size-text">
            <div className="btn-wrap">
              {sizeList.map((size, index) => {
                const isSoldOut = Boolean(soldoutList[index]);

                return (
                  <button
                    type="button"
                    key={size}
                    className={`btn ${selectedSize === size ? "active" : ""}${
                      isSoldOut ? " is-soldout" : ""
                    }`}
                    disabled={isSoldOut}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p>[필수] 옵션을 선택해 주세요.</p>
          </div>
        </div>

        <div className="op-box op-count">
          <p className="op-title">수량</p>
          <div className="btn-wrap">
            <button
              type="button"
              className="btn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <p>{quantity}</p>
            <button
              type="button"
              className="btn"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <div className="op-total">
            <p>총 상품금액 : </p>
            <p>{formatPrice(totalPrice)}</p>
          </div>
        </div>

        <div className="op-buy-button">
          <button
            type="button"
            className="Bbtn"
            disabled={selectedSoldOut}
            onClick={handleBuyNow}
          >
            바로구매
          </button>
          <button
            type="button"
            className="btn"
            disabled={selectedSoldOut}
            onClick={handleAddCart}
          >
            장바구니
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
