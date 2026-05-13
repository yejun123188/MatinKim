import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import {
  getRecentViewedProducts,
  setRecentViewedProducts,
} from "../utils/recentViewedProducts";
import "./scss/RecentViewedProducts.scss";
import UserInfoNone from "./UserInfoNone";

const formatPrice = (price) =>
  `₩ ${Number(price || 0).toLocaleString("ko-KR")}`;

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
    const size = product.sizes?.[0] || "FREE";
    const color = product.colors?.[0] || "";

    onAddCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      count: 1,
      image: product.img,
      key: `${product.id}-${size}-${color}`,
    });
  };

  return (
    <div className="recent-products-wrap">
      <div className="recent-products-top">
        <button type="button" className="Wbtn" onClick={() => updateProducts([])}>
          전체삭제
        </button>
      </div>

      <div className="recent-products-panel">
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
                    {product.name}
                  </button>

                  <div className="recent-product-price">
                    <span>{formatPrice(product.price)}</span>
                    {product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}
                  </div>

                  <div className="button-wrap">
                    <button
                      type="button"
                      className="Bbtn"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      바로구매
                    </button>

                    <button
                      type="button"
                      className="Wbtn"
                      onClick={() => handleAddCart(product)}
                    >
                      장바구니
                    </button>

                    <button
                      type="button"
                      className="Wbtn"
                      onClick={() => handleRemove(product.id)}
                    >
                      삭제
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
    </div>
  );
}
