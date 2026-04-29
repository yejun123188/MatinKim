const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const normalizeDateRange = (startDate, endDate) => {
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
