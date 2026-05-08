import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";

export default function WishItem({ wish, onEditOptions, onCartPopup, variant = "card" }) {
    const navigate = useNavigate();
    const { onAddCart, onRemoveWish } = useProductStore();
    const { user: authUser } = useAuthStore();

    const isSoldOut = Boolean(wish.isSoldOut);

    const cartPayload = {
        id: wish.id,
        name: wish.name,
        price: wish.price,
        discountPrice: wish.discountPrice,
        discountRate: wish.discountRate,
        mainImg: wish.mainImg,
        hoverImg: wish.hoverImg,
        image: wish.mainImg || wish.hoverImg,
        key: `${wish.id}-${wish.selectedSize}-${wish.selectedColor}`,
        size: wish.selectedSize,
        color: wish.selectedColor,
        count: wish.quantity,
    };

    const handleAddCart = () => {
        onAddCart(cartPayload);
        // 부모에서 CartPopup 열기 (CartPopup이 있는 경우)
        onCartPopup?.(wish);
    };

    const handleBuyNow = () => {
        navigate("/payment", {
            state: {
                orderItems: [
                    {
                        id: wish.id,
                        brand: "MATIN KIM",
                        name: wish.name,
                        option: `${wish.selectedColor} / ${wish.selectedSize}`,
                        quantity: wish.quantity,
                        price: wish.discountRate > 0 ? wish.discountPrice : wish.price,
                        image: wish.mainImg || wish.hoverImg,
                    },
                ],
            },
        });
    };

    const handleRemove = () => {
        onRemoveWish(wish.key, authUser?.uid);
    };

    const handleNavigate = () => navigate(`/products/${wish.id}`);

    if (variant === "list") {
        return (
            <>
                <div className="img-box" onClick={handleNavigate}>
                    <img src={wish.mainImg} alt={wish.name} />
                </div>
                <div>
                    <div className="text-box">
                        <p className="title" onClick={handleNavigate}>{wish.name}</p>
                        {wish.discountRate > 0 ? (
                            <div className="price-box">
                                <strong className="discount-price">₩{wish.discountPrice?.toLocaleString()}원</strong>
                                <span className="price">{wish.price?.toLocaleString()}원</span>
                                <span className="discount-rate">{wish.discountRate}%</span>
                            </div>
                        ) : (
                            <strong className="price2">₩{wish.price?.toLocaleString()}원</strong>
                        )}
                    </div>
                    {!isSoldOut ? (
                        <div className="option-box">
                            <p className="option">{wish.selectedColor} / {wish.selectedSize} / {wish.quantity}개</p>
                        </div>
                    ) : (
                        <span className="soldout-badge">SOLD OUT</span>
                    )}
                    <div className="button-wrap">
                        {!isSoldOut && (
                            <>
                                {/* Buy It Now → /payment으로 이동 */}
                                <button className="Bbtn" onClick={handleBuyNow}>바로구매</button>
                                {/* Add To Cart → onAddCart + CartPopup */}
                                <button className="Wbtn" onClick={handleAddCart}>카트담기</button>
                            </>
                        )}
                        <button className="Wbtn" onClick={handleRemove}>삭제</button>
                    </div>
                </div>
            </>
        );
    }

    // variant="card"
    return (
        <>
            <div className="img-box" onClick={handleNavigate}>
                <img src={wish.mainImg} alt={wish.name} />
            </div>
            <div className="text-box">
                <div className="text-wrap">
                    <p className="wish-name" onClick={handleNavigate}>{wish.name}</p>
                    <p className="wish-price">
                        ￦{wish.price.toLocaleString()}
                        {wish.discountRate > 0 && (
                            <span>￦{wish.discountPrice.toLocaleString()}</span>
                        )}
                    </p>
                    <p className="wish-count">
                        {isSoldOut
                            ? "SOLD OUT"
                            : `${wish.selectedSize} / ${wish.selectedColor} / ${wish.quantity}개`}
                    </p>
                </div>
                <div className="button-wrap">
                    {!isSoldOut && (
                        <>
                            <button className="Bbtn" onClick={handleBuyNow}>
                                바로구매
                            </button>
                            <button className="Wbtn" onClick={handleAddCart}>
                                카트담기
                            </button>
                        </>
                    )}
                    <button className="Wbtn" onClick={handleRemove}>
                        삭제
                    </button>
                </div>
            </div>
        </>
    );
}