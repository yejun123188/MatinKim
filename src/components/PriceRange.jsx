import React, { useEffect, useState } from "react";
import "./scss/priceRange.scss";

export default function PriceRange({
    onSearch,
    min = 0,
    max = 1000,
    step = 1000
}) {
    const safeMax = Math.max(max, min + step);

    const [minPrice, setMinPrice] = useState(min);
    const [maxPrice, setMaxPrice] = useState(max);

    useEffect(() => {
        setMinPrice(min);
        setMaxPrice(max);
    }, [min, max]);

    // 슬라이더 변경
    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice - step);
        setMinPrice(value);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), minPrice + step);
        setMaxPrice(value);
    };

    // 검색 버튼
    const handleSearch = () => {
        if (onSearch) {
            onSearch({ minPrice, maxPrice });
        }
    };

    const denominator = safeMax - min || 1;
    const perStart = ((minPrice - min) / denominator) * 100;
    const perEnd = ((maxPrice - min) / denominator) * 100;

    return (
        <div className="price-container">

            {/* 슬라이더 */}
            <div className="slider-wrap">
                <input
                    type="range"
                    min={min}
                    max={safeMax}
                    step={step}
                    value={minPrice}
                    onChange={handleMinChange}
                    className="thumb thumb-left"
                    style={{ "--per": `${perStart}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={safeMax}
                    step={step}
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
                            left: `${((minPrice - min) / denominator) * 100}%`,
                            right: `${100 - ((maxPrice - min) / denominator) * 100}%`
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
