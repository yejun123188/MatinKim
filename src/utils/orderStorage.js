import pastOrdersData from "../data/ordersData.json";

const ORDER_STORAGE_KEY = "matinKimOrders";
const DEMO_ORDER_NUMBER_STORAGE_KEY = "matinKimDemoOrderNumbers";

export const ORDER_MENU = "주문내역";

const ORDER_STATUS_STEPS = ["결제완료", "배송준비중", "배송중", "배송완료"];

const REQUEST_STATUS = {
  cancel: ["취소요청처리중", "취소완료"],
  return: ["반품요청처리중", "반품완료"],
  exchange: ["교환요청처리중", "교환완료"],
};

const pad = (value) => String(value).padStart(2, "0");

export const formatOrderDateKey = (date = new Date()) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

const getStoredDemoOrderNumbers = () => {
  try {
    return JSON.parse(
      localStorage.getItem(DEMO_ORDER_NUMBER_STORAGE_KEY) || "{}",
    );
  } catch {
    return {};
  }
};

const createRandomDigits = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

const createDemoOrderNumber = (id, date) => {
  const savedOrderNumbers = getStoredDemoOrderNumbers();

  if (savedOrderNumbers[id]) return savedOrderNumbers[id];

  const orderNumber = `${formatOrderDateKey(date)}-${createRandomDigits(
    6,
  )}-${createRandomDigits(3)}`;

  localStorage.setItem(
    DEMO_ORDER_NUMBER_STORAGE_KEY,
    JSON.stringify({
      ...savedOrderNumbers,
      [id]: orderNumber,
    }),
  );

  return orderNumber;
};

const getRelativeDate = (now, updater) => {
  const date = new Date(now);
  updater(date);
  return date;
};

const createDemoOrder = ({
  id,
  date,
  state,
  status,
  product,
  orderNumber,
}) => ({
  id,
  state,
  date: formatOrderDateKey(date),
  orderNumber,
  name: "마뗑킴",
  phone: "010-1234-5678",
  address: "마뗑시 마뗑구 마뗑킴로 123-12 마뗑빌라",
  payment: "신용카드",
  deliveryCost: 0,
  orders: [
    {
      id: `${id}-1`,
      status,
      count: 1,
      ...product,
    },
  ],
});

const getDemoFilterOrders = (now = Date.now()) => {
  const monthDate = getRelativeDate(now, (date) => date.setDate(date.getDate() - 8));
  const sixMonthDate = getRelativeDate(now, (date) => {
    date.setMonth(date.getMonth() - 3);
    date.setDate(date.getDate() - 1);
  });

  const orderProduct = {
    name: "MATIN KIM CIRCLE LOGO TOP FOR MEN IN BLACK",
    img: "https://matinkim.com/web/product/medium/202604/d6581a7ba9b5fa28d8890d1ad3aa9b42.jpg",
    price: 68000,
    size: "M",
  };
  const cancelProduct = {
    name: "CAMOUFLAGE LOGO BALL CAP IN BEIGE",
    img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202602/377cb8c737dfecc223743aada3501cf5.jpg",
    price: 68000,
    size: "FREE",
  };

  return [
    createDemoOrder({
      id: "demo-order-month",
      date: monthDate,
      state: "주문완료",
      status: "배송완료",
      product: orderProduct,
      orderNumber: createDemoOrderNumber("demo-order-month", monthDate),
    }),
    createDemoOrder({
      id: "demo-order-six-month",
      date: sixMonthDate,
      state: "주문완료",
      status: "배송완료",
      product: {
        name: "PATCHWORK CARGO BERMUDA PANTS FOR MEN IN BEIGE",
        img: "https://matinkim.com/web/product/medium/202604/af24497fdacbac8b575687c878af7669.jpg",
        price: 198000,
        size: "L",
      },
      orderNumber: createDemoOrderNumber("demo-order-six-month", sixMonthDate),
    }),
    createDemoOrder({
      id: "demo-cancel-month",
      date: monthDate,
      state: "취소",
      status: "취소완료",
      product: cancelProduct,
      orderNumber: createDemoOrderNumber("demo-cancel-month", monthDate),
    }),
    createDemoOrder({
      id: "demo-cancel-six-month",
      date: sixMonthDate,
      state: "취소",
      status: "취소완료",
      product: {
        name: "MATIN LIGHT MESH CAP IN BLACK",
        img: "https://cafe24img.poxo.com/kimdaniyaya/web/product/medium/202603/de8e4df27a4d897c4f265a7c5ac38a09.jpg",
        price: 58000,
        size: "FREE",
      },
      orderNumber: createDemoOrderNumber("demo-cancel-six-month", sixMonthDate),
    }),
  ];
};

const createOrderNumber = (dateKey) =>
  `${dateKey}-${String(Date.now()).slice(-6)}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

const readStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeStoredOrders = (orders) => {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
};

const getSecondsFrom = (dateValue, now = Date.now()) => {
  const time = new Date(dateValue).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.max(Math.floor((now - time) / 1000), 0);
};

export const getOrderStatus = (order, orderDetail, now = Date.now()) => {
  if (order.status === "조회불가") return "조회불가";

  if (order.requestAction) {
    const [pending, done] = REQUEST_STATUS[order.requestAction] || [];
    return getSecondsFrom(order.requestedAt, now) >= 10 ? done : pending;
  }

  if (!orderDetail.createdAt) return order.status || "배송완료";

  const stepIndex = Math.min(
    Math.floor(getSecondsFrom(orderDetail.createdAt, now) / 10),
    ORDER_STATUS_STEPS.length - 1,
  );

  return ORDER_STATUS_STEPS[stepIndex];
};

const withComputedStatuses = (orderDetail, now = Date.now()) => ({
  ...orderDetail,
  orderNumber:
    orderDetail.orderNumber || `PAST-${orderDetail.date}-${orderDetail.id}`,
  orders: orderDetail.orders.map((order) => ({
    ...order,
    status: getOrderStatus(order, orderDetail, now),
  })),
});

export const getAllOrders = (now = Date.now()) => [
  ...readStoredOrders().map((order) => withComputedStatuses(order, now)),
  ...getDemoFilterOrders(now).map((order) => withComputedStatuses(order, now)),
  ...pastOrdersData.map((order) => withComputedStatuses(order, now)),
];

export const getOrderById = (id, now = Date.now()) =>
  getAllOrders(now).find((order) => String(order.id) === String(id));

export const createOrder = ({
  orderItems,
  orderForm,
  shippingInfo,
  payment,
  deliveryCost = 0,
}) => {
  const createdAt = new Date();
  const date = formatOrderDateKey(createdAt);
  const id = `order-${createdAt.getTime()}`;
  const orderNumber = createOrderNumber(date);

  const order = {
    id,
    state: "주문완료",
    date,
    createdAt: createdAt.toISOString(),
    orderNumber,
    name: shippingInfo.receiver || orderForm.name,
    phone: `${shippingInfo.mobile1 || "010"}-${shippingInfo.mobile2 || ""}-${
      shippingInfo.mobile3 || ""
    }`,
    address: [shippingInfo.address, shippingInfo.detail]
      .filter(Boolean)
      .join(" "),
    payment,
    deliveryCost,
    orders: orderItems.map((item, index) => {
      const [color = "-", size = "-"] = String(item.option || "").split(" / ");

      return {
        id: `${id}-${index + 1}`,
        name: item.name,
        img:
          item.image ||
          item.mainImg ||
          item.hoverImg ||
          "/images/sub-cart/clothes-mini.jpg",
        price: Number(item.price || 0),
        status: "결제완료",
        color,
        size,
        count: Number(item.quantity || 1),
      };
    }),
  };

  writeStoredOrders([order, ...readStoredOrders()]);
  return order;
};

export const requestOrderAction = ({ orderDetailId, itemIds, action }) => {
  const ids = new Set(itemIds.map(String));
  const requestedAt = new Date().toISOString();
  const orders = readStoredOrders().map((orderDetail) => {
    if (String(orderDetail.id) !== String(orderDetailId)) return orderDetail;

    return {
      ...orderDetail,
      state: action,
      orders: orderDetail.orders.map((order) =>
        ids.has(String(order.id))
          ? {
              ...order,
              requestAction: action,
              requestedAt,
            }
          : order,
      ),
    };
  });

  writeStoredOrders(orders);
};

export const getTrackingHistory = (orderDetail, now = Date.now()) => {
  const createdAt = new Date(orderDetail.createdAt || Date.now()).getTime();
  const elapsed = Math.max(Math.floor((now - createdAt) / 1000), 0);
  const stepCount = Math.min(Math.floor(elapsed / 20) + 1, 4);
  const steps = [
    ["상품인수", "보내시는 고객님으로부터 상품을 인수받았습니다."],
    ["상품이동중", "물류센터로 상품이 이동중입니다."],
    ["배송지도착", "고객님의 상품이 배송지에 도착하였습니다."],
    ["배송출발", "고객님의 상품을 배송할 예정입니다."],
  ];

  return steps.slice(0, stepCount).map(([label, description], index) => {
    const date = new Date(createdAt + index * 20000);

    return {
      label,
      description,
      dateTime: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds(),
      )}`,
    };
  });
};
