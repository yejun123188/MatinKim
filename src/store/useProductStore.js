import { create } from "zustand";
import products from "../data/products";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const subMenuMap = {
  Outerwears: "아우터",
  Tops: "상의",
  Bottoms: "하의",
  Dresses: "드레스",
  Bags: "가방",
  Shoes: "신발",
  Wallets: "지갑",
  "Hats & Caps": "모자",
  Hair: "헤어",
  Neckwear: "넥웨어",
  "Pouches & Cases": "파우치",
  Others: "기타",
};

const urlMap = {
  Outerwears: "outerwears",
  Tops: "tops",
  Bottoms: "bottoms",
  Dresses: "dresses",
  Bags: "bags",
  Shoes: "shoes",
  Wallets: "wallets",
  "Hats & Caps": "hats",
  Hair: "hair",
  Neckwear: "neckwear",
  "Pouches & Cases": "pouches",
  Others: "others",
};

const COLOR_PALETTE = {
  "LIGHT BEIGE": "#F5F5DC",
  CREAM: "#FFFDD0",
  "DARK BROWN": "#654321",
  BLUE: "#0000FF",
  "LIGHT GREY": "#D3D3D3",
  CHARCOAL: "#36454F",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  "DARK GREY": "#A9A9A9",
  PINK: "#FFC0CB",
  MINT: "#98FF98",
  IVORY: "#FFFFF0",
  BEIGE: "#F5F5DC",
  GREY: "#808080",
  "STRONG BLACK": "#050505",
  BROWN: "#A52A2A",
  KHAKI: "#F0E68C",
  NAVY: "#000080",
  "LIGHT BLUE": "#ADD8E6",
  MIX: "linear-gradient(45deg, #eee, #333)",
  "KHAKI BROWN": "#70543E",
  BURGUNDY: "#800020",
  LILAC: "#C8A2C8",
  OLIVE: "#808000",
  "SMOKE BLUE": "#59788E",
  COCOA: "#D2691E",
  "LIGHT KHAKI": "#F0E68C",
  RED: "#FF0000",
  "DARK NAVY": "#000040",
  SKY: "#87CEEB",
  "POWDER BLUE": "#B0E0E6",
  "LIGHT YELLOW": "#FFFFE0",
  CAMEL: "#C19A6B",
  BUTTER: "#FFFD74",
  "DARK BEIGE": "#B79268",
  PURPLE: "#800080",
  "LIGHT GREEN": "#90EE90",
  "LIGHT ORANGE": "#FFB347",
  LIME: "#00FF00",
  "TURQUISE BLUE": "#00CED1",
  PEACH: "#FFDAB9",
  YELLOW: "#FFFF00",
  "KHAKI BEIGE": "#BEB7A4",
  "LIGHT PINK": "#FFB6C1",
  "SMOKE PINK": "#D0A9AA",
  GREEN: "#008000",
  "OFF WHITE": "#FAF9F6",
  ORANGE: "#FFA500",
  "INDIAN PINK": "#E3A39A",
  SILVER: "#C0C0C0",
  WINE: "#722F37",
  "DARK SILVER": "#71706E",
  "DARK GREEN": "#006400",
  GOLD: "#FFD700",
  VIOLET: "#EE82EE",
};

// ProductDetail과 동일한 베이스명 추출 로직
const getProductBaseName = (item) => {
  if (!item?.name) return "";
  const primaryColor = item.colors?.[0];
  const colorSuffix = primaryColor ? ` IN ${primaryColor}` : "";
  return colorSuffix && item.name.endsWith(colorSuffix)
    ? item.name.slice(0, -colorSuffix.length)
    : item.name;
};

export const useProductStore = create((set, get) => ({
  //상품~~~~~~~~~~~~~~~~~~~~~~~~~~~
  items: [],
  colors: [],
  onFetchItem: async () => {
    const existing = get().items;
    if (existing.length > 0) return;

    const allColors = [
      ...new Set([].concat(...products.map((item) => item.colors))),
    ];

    set({ items: products, colors: allColors });
  },

  onColorCode: (colorName) => {
    if (!colorName) return "#ccc";
    return COLOR_PALETTE[colorName.toUpperCase()] || "#ccc";
  },

  //메뉴~~~~~~~~~~~~~~~~~~~~~~~
  menus: [],
  onMenus: () => {
    const { items } = get();
    const menuList = [];

    items.forEach(({ category1, category2 }) => {
      const cat1 = category1.toLowerCase();
      const cat2 = category2?.toUpperCase();
      const catOut = cat2 === "OUTERWEARS" ? "OUTER" : cat2;
      const koCat2 = subMenuMap[category2] || category2;

      let mainMenu = menuList.find((menu) => menu.name === cat1);
      if (!mainMenu) {
        mainMenu = { name: cat1, link: `/${cat1}`, subMenu: [] };
        menuList.push(mainMenu);
      }

      const subMenu = mainMenu.subMenu.find((menu) => menu.name === koCat2);
      if (!subMenu && cat2) {
        mainMenu.subMenu.push({
          name: koCat2,
          subName: catOut,
          link: `/${cat1}/${urlMap[category2] || category2.toLowerCase()}`,
        });
      }
    });

    set({ menus: menuList });
  },

  BestItems: [],
  onBestMenus: () => {
    const { items } = get();
    set({ BestItems: items.filter((item) => Array.isArray(item.tag) && item.tag.includes("MUST HAVE")) });
  },

  // 선택한 아이템들만 장바구니에서 제거
  onRemoveItems: (keys) => {
    const cart = get().cartItem;
    const updateCart = cart.filter((item) => !keys.includes(item.key));
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({
      cartItem: updateCart,
      cartCount: updateCart.length,
      totalPrice: get().onTotal(updateCart),
    });
  },
  //신상품(NEW IN)만 뽑는 메서드
  //신상품아이템 저장할 배열
  NewItems: [],
  onNewMenus: () => {
    const { items } = get();
    set({ NewItems: items.filter((item) => Array.isArray(item.tag) && item.tag.includes("NEW IN")) });
  },

  //~~~~~~~장바구니~~~~~~~~~~~~~~~~~~~~
  cartItem: JSON.parse(localStorage.getItem("cartItem")) || [],
  cartCount: JSON.parse(localStorage.getItem("cartItem"))?.length || 0,
  totalPrice: 0,
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  onClearCart: () => {
    localStorage.removeItem("cartItem");
    set({ cartItem: [], cartCount: 0, totalPrice: 0 });
  },
  onClearUserProductData: () => {
    localStorage.removeItem("cartItem");
    set({ cartItem: [], cartCount: 0, totalPrice: 0, wishList: [] });
  },

  onAddCart: (product) => {
    const cart = get().cartItem;
    const existing = cart.find((item) => item.key === product.key);

    let updateCart;
    if (existing) {
      updateCart = cart.map((item) =>
        item.key === product.key
          ? { ...item, count: item.count + product.count }
          : item,
      );
    } else {
      updateCart = [...cart, { ...product }];
    }
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({
      cartItem: updateCart,
      cartCount: updateCart.length,
      totalPrice: get().onTotal(updateCart),
    });
  },

  onTotal: (cart) => cart.reduce((acc, cur) => acc + cur.price * cur.count, 0),

  onUpdateQuantity: (key, type) => {
    const cart = get().cartItem;
    const updateCart = cart.map((item) => {
      if (item.key === key) {
        if (type === "minus" && item.count > 1) return { ...item, count: item.count - 1 };
        if (type === "plus") return { ...item, count: item.count + 1 };
      }
      return item;
    });
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({ cartItem: updateCart, totalPrice: get().onTotal(updateCart) });
  },
  onRemoveItem: (key) => {
    const cart = get().cartItem;
    const updateCart = cart.filter((item) => item.key !== key);
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({
      cartItem: updateCart,
      cartCount: updateCart.length,
      totalPrice: get().onTotal(updateCart),
    });
  },
  onReduceItems: (orderedItems) => {
    const cart = get().cartItem;

    const updateCart = cart.reduce((acc, cartItem) => {
      const ordered = orderedItems.find((o) => o.key === cartItem.key);
      if (!ordered) {
        // 주문 안 한 상품은 그대로
        acc.push(cartItem);
      } else {
        const remaining = cartItem.count - ordered.quantity;
        if (remaining > 0) {
          // 수량이 남으면 차감해서 유지
          acc.push({ ...cartItem, count: remaining });
        }
        // remaining <= 0 이면 제거 (push 안 함)
      }
      return acc;
    }, []);


  onRemoveItem: (id, size) => {
    const cart = get().cartItem;
    const updateCart = cart.filter((item) => !(item.id === id && item.size === size));
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({ cartItem: updateCart, cartCount: updateCart.length, totalPrice: get().onTotal(updateCart) });
  },

  // 옵션(색상·사이즈) 변경 — 이름·이미지·id 모두 색상 상품 기준으로 교체
  onUpdateOption: (oldKey, { size, color }) => {
    const cart = get().cartItem;
    const target = cart.find((item) => item.key === oldKey);
    if (!target) return;

    const allItems = get().items;
    const productData = allItems.find((p) => p.id === target.id) || target;
    const baseName = getProductBaseName(productData);

    // colorProductMap 방식: 같은 베이스명 + primary color 일치
    const colorProduct = allItems.find((p) => {
      if (p.colors?.[0] !== color) return false;
      return getProductBaseName(p) === baseName;
    });

    const newImage = colorProduct?.mainImg || target.image;
    const newName = colorProduct?.name || target.name;
    const newId = colorProduct?.id || target.id;
    const newKey = `${newId}-${size}-${color}`;

    const updatedItem = {
      ...target,
      id: newId,
      name: newName,
      size,
      color,
      image: newImage,
      key: newKey,
    };

    const updateCart = cart.map((item) => item.key === oldKey ? updatedItem : item);
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({ cartItem: updateCart, totalPrice: get().onTotal(updateCart) });
  },

  //~~~~상품검색~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  onSearchitem: (word) => {
    const items = get();
    const result = items.map((item) => {
      const filter = item.filter(
        (i) => i.name.includes(word.toLowerCase()) || i.bullet_point.includes(word),
      );
    });
    set({});
  },
  onUpdateOption: (key, { size, color }) => {
    const cart = get().cartItem;
    const newKey = (item) => `${item.id}-${size}-${color}`;

    const updateCart = cart.map((item) =>
      item.key === key
        ? { ...item, size, color, key: newKey(item) }
        : item
    );
    localStorage.setItem("cartItem", JSON.stringify(updateCart));
    set({
      cartItem: updateCart,
      cartCount: updateCart.length,
      totalPrice: get().onTotal(updateCart),
    });
  },

  //~~~위시리스트~~~~~~~~~~~~~~~~~~~~~
  wishList: [],

  onLoadWishList: async (uid) => {
    try {
      const ref = doc(db, "wishlists", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        set({ wishList: snap.data().list || [] });
      } else {
        set({ wishList: [] });
      }
    } catch (e) {
      console.error("위시리스트 불러오기 실패", e);
    }
  },

  _saveWishList: async (uid, list) => {
    if (!uid || typeof uid !== "string" || uid.trim() === "") return;
    try {
      const safeList = list.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price ?? 0,
        discountPrice: p.discountPrice ?? 0,
        discountRate: p.discountRate ?? 0,
        mainImg: p.mainImg || "",
        selectedSize: p.selectedSize || "",
        selectedColor: p.selectedColor || "",
        quantity: p.quantity ?? 1,
        key: p.key || "",
        category1: p.category1 || "",
        category2: p.category2 || "",
        isSoldOut: p.isSoldOut ?? false,
      }));
      const ref = doc(db, "wishlists", uid);
      await setDoc(ref, { list: safeList });
    } catch (e) {
      console.error("위시리스트 저장 실패", e.code, e.message);
    }
  },

  onAddWishList: async (product, uid) => {
    const wish = get().wishList;
    const existing = wish.find((w) => w.key === product.key);
    if (existing) {
      alert("이미 찜한 상품입니다");
      return;
    }
    const updated = [...wish, product];
    set({ wishList: updated });
    if (uid) await get()._saveWishList(uid, updated);
  },

  onRemoveWish: async (key, uid) => {
    const updated = get().wishList.filter((w) => w.key !== key);
    set({ wishList: updated });
    if (uid) await get()._saveWishList(uid, updated);
  },
}));