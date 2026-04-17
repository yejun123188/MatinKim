import React, { useEffect, useState } from "react";
import "./scss/TimeSalePopup.scss";

export default function TimeSalePopup() {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const hideUntil = localStorage.getItem("hideTimeSaleUntil");

        if (hideUntil && new Date().getTime() < Number(hideUntil)) {
            setIsOpen(false);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleHideToday = () => {
        const now = new Date();
        const tomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        ).getTime();

        localStorage.setItem("hideTimeSaleUntil", String(tomorrow));
        setIsOpen(false);
    };

    if (!isOpen) return null;






    return (
        <section className="time-sale-section">
            {/* 배경 비주얼 */}

            {/* 팝업 */}
            <div className="sale-popup">
                <div className="sale-popup-inner">
                    <div className="sale">
                        <strong>TIME SALE</strong>
                    </div>

                    <div className="sale-time">
                        <span>03</span>
                        <em>:</em>
                        <span>17</span>
                        <em>:</em>
                        <span>05</span>
                        <em>:</em>
                        <span>15</span>
                    </div>

                    <div className="sale-labels">
                        <span>DAYS</span>
                        <span>HRS</span>
                        <span>MINS</span>
                        <span>SECS</span>
                    </div>

                    <p className="sale-date">26.03.27 ~ 26.04.10</p>
                </div>

                <div className="sale-popup-btns">
                    <button type="button" onClick={handleHideToday}>
                        오늘 하루 열지 않기
                    </button>
                    <button type="button" onClick={handleClose}>
                        닫기
                    </button>
                </div>
            </div>
        </section>
    );
}


