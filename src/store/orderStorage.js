export const ORDER_MENU = "주문내역";
const STORAGE_KEY = "matinKimOrders"; // ✅ 기존 키로 통일

export const generateOrderNumber = () => {
    const today = new Date();
    const date = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${date}-${random}`;
};

export const createOrder = ({ orderItems, orderForm, shippingInfo, payment, deliveryCost }) => {
    const orderNumber = generateOrderNumber();
    const id = `order-${Date.now()}`;

    // ✅ 기존 matinKimOrders 구조에 맞게 저장
    const order = {
        id,
        state: "주문완료",
        date: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        createdAt: new Date().toISOString(),
        orderNumber,
        name: orderForm.name,
        phone: `${orderForm.mobile1}-${orderForm.mobile2}-${orderForm.mobile3}`,
        address: `${shippingInfo.address} ${shippingInfo.detail}`,
        payment,
        deliveryCost,
        orders: orderItems.map((item, idx) => ({
            id: `${id}-${idx + 1}`,
            name: item.name,
            img: item.image || item.mainImg || item.hoverImg || "/images/sub-cart/clothes-mini.jpg",
            price: item.price,
            status: "결제완료",
            color: item.color || "-",
            size: item.option || item.size || "-",
            count: item.quantity,
        })),
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    return orderNumber;
};

export const getAllOrders = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const lookupGuestOrder = (orderNumber, name) => {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return orders.find(
        (o) => o.orderNumber === orderNumber && o.name === name
    ) || null;
};