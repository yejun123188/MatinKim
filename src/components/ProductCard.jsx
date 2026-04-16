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
                    <strong>{cate.price}</strong>
                    <span>할일전가격</span>
                    <span>20%</span>
                </div>
                <div className="color-wrap">
                    <div>{cate.colors}</div>
                </div>
            </div>
        </li>
    )
}
