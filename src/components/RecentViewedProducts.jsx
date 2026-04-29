import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import {
  getRecentViewedProducts,
  setRecentViewedProducts,
} from "../utils/recentViewedProducts";
import "./scss/RecentViewedProducts.scss";
import UserInfoNone from "./UserInfoNone";

const formatPrice = (price) => `₩${Number(price || 0).toLocaleString("ko-KR")}`;

const trimName = (name = "") =>
  name.length > 32 ? `${name.slice(0, 32)}...` : name;

export default function RecentViewedProducts() {
  const navigate = useNavigate();
  const { onAddCart } = useProductStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getRecentViewedProducts());
  }, []);

  const updateProducts = (nextProducts) => {
    setProducts(nextProducts);
    setRecentViewedProducts(nextProducts);
  };

  const handleRemove = (id) => {
    updateProducts(products.filter((product) => product.id !== id));
  };

  const handleAddCart = (product) => {
    onAddCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes?.[0] || "FREE",
      color: product.colors?.[0] || "",
      count: 1,
      image: product.img,
      key: `${product.id}-${product.sizes?.[0] || "FREE"}-${product.colors?.[0] || ""}`,
    });
  };

  return (
    <div className="recent-products-wrap">
      <div className="recent-products-top">
        <button type="button" onClick={() => updateProducts([])}>
          전체 삭제
        </button>
      </div>

      <ul className="recent-product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="recent-product-item">
              <button
                type="button"
                className="recent-product-img"
                onClick={() => navigate(`/products/${product.id}`)}
                aria-label={`${product.name} 상세보기`}
              >
                <img src={product.img} alt={product.name} />
              </button>

              <div className="recent-product-info">
                <button
                  type="button"
                  className="recent-product-name"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {trimName(product.name)}
                </button>

                <div className="recent-product-price">
                  <span>{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <del>{formatPrice(product.originalPrice)}</del>
                  )}
                </div>

                <div className="button-wrap">
                  <button
                    type="button"
                    className="Bbtn"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Buy It Now
                  </button>
                  <button
                    type="button"
                    className="Wbtn"
                    onClick={() => handleAddCart(product)}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="Wbtn"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <UserInfoNone title="상품" />
        )}
      </ul>
    </div>
  );
}
