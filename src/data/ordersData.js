import rawOrdersData from "./ordersData.json";

const createOrderNumber = (date) =>
  `${date}-${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`;

const ordersData = rawOrdersData.map((order) => ({
  ...order,
  orderNumber: createOrderNumber(order.date),
}));

export default ordersData;
