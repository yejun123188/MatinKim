import React, { useEffect, useRef, useState } from "react";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDateRange = (startDate, endDate) => {
  if (!startDate || !endDate || startDate <= endDate) {
    return { startDate, endDate };
  }

  return {
    startDate: endDate,
    endDate: startDate,
  };
};

export const getQuickRangeValues = (type, baseDate = new Date()) => {
  const today = new Date(baseDate);
  const start = new Date(baseDate);

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

  const nextRange =
    type === "today"
      ? {
          startDate: formatDate(today),
          endDate: formatDate(today),
        }
      : {
          startDate: formatDate(start),
          endDate: formatDate(today),
        };

  return {
    ...nextRange,
    type,
  };
};

export default function OrderDateFilter({
  showFilter1 = false,
  showFilter2 = false,
  onRangeChange,
  onYearChange,
  initialRangeType = "threeMonths",
  initialStartDate,
  initialEndDate,
  initialYear = new Date().getFullYear(),
  yearOptions,
}) {
  const initialRange = getQuickRangeValues(initialRangeType);
  const [selectedDate, setSelectedDate] = useState(initialRange.type);
  const [startDate, setStartDate] = useState(
    initialStartDate || initialRange.startDate,
  );
  const [endDate, setEndDate] = useState(
    initialEndDate || initialRange.endDate,
  );
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    setYear(initialYear);
  }, [initialYear]);

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

  const handleQuickRange = (type) => {
    const nextRange = getQuickRangeValues(type);
    setStartDate(nextRange.startDate);
    setEndDate(nextRange.endDate);
    setSelectedDate(nextRange.type);
    onRangeChange?.(nextRange);
  };

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    setSelectedDate("custom");
  };

  const handleEndChange = (e) => {
    setEndDate(e.target.value);
    setSelectedDate("custom");
  };

  const handleRangeSubmit = () => {
    const normalizedRange = normalizeDateRange(startDate, endDate);
    setStartDate(normalizedRange.startDate);
    setEndDate(normalizedRange.endDate);
    onRangeChange?.({
      ...normalizedRange,
      type: "custom",
    });
  };

  const handleYearSubmit = () => {
    onYearChange?.(year);
    setOpen(false);
  };

  const years =
    yearOptions?.length > 0
      ? yearOptions
      : Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      {showFilter1 && (
        <div className="date-filter-wrap">
          <div className="date-btn-wrap">
            <button
              type="button"
              className={selectedDate === "today" ? "active" : ""}
              onClick={() => handleQuickRange("today")}
            >
              오늘
            </button>
            <button
              type="button"
              className={selectedDate === "week" ? "active" : ""}
              onClick={() => handleQuickRange("week")}
            >
              1주일
            </button>
            <button
              type="button"
              className={selectedDate === "month" ? "active" : ""}
              onClick={() => handleQuickRange("month")}
            >
              1개월
            </button>
            <button
              type="button"
              className={selectedDate === "threeMonths" ? "active" : ""}
              onClick={() => handleQuickRange("threeMonths")}
            >
              3개월
            </button>
            <button
              type="button"
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
                max={endDate || undefined}
                onChange={handleStartChange}
              />
              <img src="/images/userinfo/input-under-btn.svg" alt="under btn" />
            </div>
            <span> ~ </span>
            <div className="date-input-wrap">
              <input
                type="date"
                className="date-input"
                value={endDate}
                min={startDate || undefined}
                onChange={handleEndChange}
              />
              <img src="/images/userinfo/input-under-btn.svg" alt="under btn" />
            </div>
            <button type="button" onClick={handleRangeSubmit}>
              조회
            </button>
          </div>
        </div>
      )}

      {showFilter2 && (
        <div className="date-filter-wrap">
          <div className="custom-year-wrap">
            <div
              className="custom-year-input"
              ref={wrapRef}
              onClick={() => setOpen(!open)}
            >
              <input type="text" value={year} readOnly />
              <img src="/images/userinfo/input-under-btn.svg" alt="under btn" />

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
            <button type="button" onClick={handleYearSubmit}>
              조회
            </button>
          </div>
        </div>
      )}
    </>
  );
}
