import React, { useEffect, useRef, useState } from "react";

export default function OrderDateFilter({
  showFilter1 = false,
  showFilter2 = false,
}) {
  const [selectedDate, setSelectedDate] = useState("threeMonths");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    handleQuickRange("threeMonths");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleQuickRange = (type) => {
    const today = new Date();
    const start = new Date();

    switch (type) {
      case "today":
        break;
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "threeMonths":
        start.setMonth(today.getMonth() - 3);
        break;
      case "sixMonths":
        start.setMonth(today.getMonth() - 6);
        break;
      default:
        break;
    }

    if (type === "today") {
      setStartDate(formatDate(today));
      setEndDate(formatDate(today));
    } else {
      setStartDate(formatDate(start));
      setEndDate(formatDate(today));
    }

    setSelectedDate(type);
  };

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    setSelectedDate("custom");
  };

  const handleEndChange = (e) => {
    setEndDate(e.target.value);
    setSelectedDate("custom");
  };

  const years = [];
  const checkYear = new Date().getFullYear();
  for (let i = 0; i < 6; i++) {
    years.push(checkYear - i);
  }

  return (
    <>
      {showFilter1 && (
        <div className="date-filter-wrap">
          <div className="date-btn-wrap">
            <button
              className={selectedDate === "today" ? "active" : ""}
              onClick={() => handleQuickRange("today")}
            >
              오늘
            </button>
            <button
              className={selectedDate === "week" ? "active" : ""}
              onClick={() => handleQuickRange("week")}
            >
              1주일
            </button>
            <button
              className={selectedDate === "month" ? "active" : ""}
              onClick={() => handleQuickRange("month")}
            >
              1개월
            </button>
            <button
              className={selectedDate === "threeMonths" ? "active" : ""}
              onClick={() => handleQuickRange("threeMonths")}
            >
              3개월
            </button>
            <button
              className={selectedDate === "sixMonths" ? "active" : ""}
              onClick={() => handleQuickRange("sixMonths")}
            >
              6개월
            </button>
          </div>

          <div className="custom-date-wrap">
            <div className="date-input-wrap">
              <input
                type="date"
                className="date-input"
                value={startDate}
                onChange={handleStartChange}
              />
              <img
                src="./images/userinfo/input-under-btn.svg"
                alt="under btn"
              />
            </div>
            <span> ~ </span>
            <div className="date-input-wrap">
              <input
                type="date"
                className="date-input"
                value={endDate}
                onChange={handleEndChange}
              />
              <img
                src="./images/userinfo/input-under-btn.svg"
                alt="under btn"
              />
            </div>
            <button>조회</button>
          </div>
        </div>
      )}
      {showFilter2 && (
        <div className="date-filter-wrap">
          <div
            className="custom-year-wrap"
            ref={wrapRef}
            onClick={() => setOpen(!open)}
          >
            <input type="text" value={year} readOnly />
            <img src="./images/userinfo/input-under-btn.svg" alt="under btn" />

            {open && (
              <div className="year-list">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setOpen(false);
                    }}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
