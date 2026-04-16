import React from 'react'

export default function ProductCard({ cate }) {
    return (
        <li className="product-card">
            <div className="img-box">
                <img src={cate.mainImg} alt="" />
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className="text-box">
                <h3>{cate.name}</h3>
                <div>
                    {cate.discountRate > 0 ? (
                        <>
                            <strong>{cate.discountPrice.toLocaleString()}원</strong>
                            <span>{cate.discountRate}%</span>
                            <span>{cate.price.toLocaleString()}원</span>
                        </>
                    ) : (
                        <strong>{cate.price.toLocaleString()}원</strong>
                    )}
                </div>
                <div className="color-wrap">
                    <div>{cate.colors}</div>
                </div>
            </div>
        </li>
    )
}
