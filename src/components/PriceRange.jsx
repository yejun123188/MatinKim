import React, { useState } from "react";
import "./scss/priceRange.scss";

export default function PriceRange({ onSearch }) {
    const MIN = 50000;
    const MAX = 450000;

    const [minPrice, setMinPrice] = useState(MIN);
    const [maxPrice, setMaxPrice] = useState(MAX);

    // 슬라이더 변경
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - 1000);
        setMinPrice(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + 1000);
        setMaxPrice(value);
    };

    // 검색 버튼
    const handleSearch = () => {
        if (onSearch) {
            onSearch({ minPrice, maxPrice });
        }
    };

    const perStart = ((minPrice - MIN) / (MAX - MIN)) * 100;
    const perEnd = ((maxPrice - MIN) / (MAX - MIN)) * 100;

    return (
        <div className="price-container">

            {/* 슬라이더 */}
            <div className="slider-wrap">
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={minPrice}
                    onChange={handleMinChange}
                    className="thumb thumb-left"
                    style={{ "--per": `${perStart}%` }}
                />
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={maxPrice}
                    onChange={handleMaxChange}
                    className="thumb thumb-right"
                    style={{ "--per": `${perEnd}%` }}
                />

                <div className="slider">
                    <div className="track" />
                    <div
                        className="range"
                        style={{
                            left: `${((minPrice - MIN) / (MAX - MIN)) * 100}%`,
                            right: `${100 - ((maxPrice - MIN) / (MAX - MIN)) * 100}%`
                        }}

                    />
                </div>
            </div>

            {/* 가격 입력 */}
            <div className="price-inputs">
                <input
                    type="text"
                    value={minPrice.toLocaleString()}
                    readOnly
                />
                <span>—</span>
                <input
                    type="text"
                    value={maxPrice.toLocaleString()}
                    readOnly
                />
            </div>

            {/* 검색 버튼 */}
            <button onClick={handleSearch}>검색</button>
        </div>
    );
}