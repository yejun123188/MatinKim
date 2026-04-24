import { create } from "zustand";
import products from "../data/products"

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
    Others: "기타"
}
//색상이름이랑 색상코드 매칭
const COLOR_PALETTE = {
    "LIGHT BEIGE": "#F5F5DC", "CREAM": "#FFFDD0", "DARK BROWN": "#654321",
    "BLUE": "#0000FF", "LIGHT GREY": "#D3D3D3", "CHARCOAL": "#36454F",
    "WHITE": "#FFFFFF", "BLACK": "#000000", "DARK GREY": "#A9A9A9",
    "PINK": "#FFC0CB", "MINT": "#98FF98", "IVORY": "#FFFFF0",
    "BEIGE": "#F5F5DC", "GREY": "#808080", "STRONG BLACK": "#050505",
    "BROWN": "#A52A2A", "KHAKI": "#F0E68C", "NAVY": "#000080",
    "LIGHT BLUE": "#ADD8E6", "MIX": "linear-gradient(45deg, #eee, #333)",
    "KHAKI BROWN": "#70543E", "BURGUNDY": "#800020", "LILAC": "#C8A2C8",
    "OLIVE": "#808000", "SMOKE BLUE": "#59788E", "COCOA": "#D2691E",
    "LIGHT KHAKI": "#F0E68C", "RED": "#FF0000", "DARK NAVY": "#000040",
    "SKY": "#87CEEB", "POWDER BLUE": "#B0E0E6", "LIGHT YELLOW": "#FFFFE0",
    "CAMEL": "#C19A6B", "BUTTER": "#FFFD74", "DARK BEIGE": "#B79268",
    "PURPLE": "#800080", "LIGHT GREEN": "#90EE90", "LIGHT ORANGE": "#FFB347",
    "LIME": "#00FF00", "TURQUISE BLUE": "#00CED1", "PEACH": "#FFDAB9",
    "YELLOW": "#FFFF00", "KHAKI BEIGE": "#BEB7A4", "LIGHT PINK": "#FFB6C1",
    "SMOKE PINK": "#D0A9AA", "GREEN": "#008000", "OFF WHITE": "#FAF9F6",
    "ORANGE": "#FFA500", "INDIAN PINK": "#E3A39A", "SILVER": "#C0C0C0",
    "WINE": "#722F37", "DARK SILVER": "#71706E", "DARK GREEN": "#006400",
    "GOLD": "#FFD700", "VIOLET": "#EE82EE"
};
export const useProductStore = create((set, get) => ({
    //상품~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //상품을 저장할 배열
    items: [],
    //데이터 파일에 있는 색상 컬러 뭐 있는지 저장할 배열
    colors: [],
    //데이터 파일 불러오기
    onFetchItem: async () => {
        const existing = get().items
        //만약 데이터가 이미 존재하면 아무것도 하지 않고 반환하지롱
        if (existing.length > 0) return;
        //데이터가 존재하면 items배열에 products를 넣어

        const allColors = [...new Set(
            [].concat(...products.map(item => item.colors))
        )];

        set({
            items: products,
            colors: allColors
        });
        // console.log(products, allColors)
    },

    //글자로 되어있는 색상 -> 색상코드로 변환하는 메서드 
    onColorCode: (colorName) => {
        if (!colorName) return "#ccc";
        return COLOR_PALETTE[colorName.toUpperCase()] || "#ccc";
    },

    //메뉴~~~~~~~~~~~~~~~~~~~~~~~
    //메뉴(category1)를 저장할 배열
    menus: [],
    onMenus: () => {
        const { items } = get();
        const menuList = [];

        items.forEach(({ category1, category2 }) => {

            const cat1 = category1
            const cat2 = category2?.toUpperCase();

            const catOut = cat2 === "OUTERWEARS" ? "OUTER" : cat2;
            const koCat2 = subMenuMap[category2] || category2;

            let mainMenu = menuList.find(menu => menu.name === cat1);

            if (!mainMenu) {

                mainMenu = { name: cat1, link: `/${cat1}`, subMenu: [] };
                menuList.push(mainMenu);
            }

            let subMenu = mainMenu.subMenu.find(menu => menu.name === koCat2);

            if (!subMenu && cat2) {

                mainMenu.subMenu.push({
                    name: koCat2, subName: catOut, link: `/${cat1}/${encodeURIComponent(cat2)}`
                });
            }
        });

        set({ menus: menuList });
        // console.log(menuList);
    },
    //베스트 아이템(MUST HAVE)만 뽑는 메서드
    //베스트아이템 저장할 배열
    BestItems: [],
    onBestMenus: () => {
        const { items } = get();
        const bestItems = items.filter(item =>
            Array.isArray(item.tag) && item.tag.includes("MUST HAVE")
        );

        set({ BestItems: bestItems });
        // console.log("베수트", bestItems);
    },


    //신상품(NEW IN)만 뽑는 메서드
    //신상품아이템 저장할 배열
    NewItems: [],
    onNewMenus: () => {
        const { items } = get();
        const newItems = items.filter(item =>
            Array.isArray(item.tag) && item.tag.includes("NEW IN")
        );

        set({ NewItems: newItems });
        // console.log("신상", newItems);
    },
    //~~~~~~~장바구니~~~~~~~~~~~~~~~~~~~~
    //장바구니에 담을 아이템저장
    cartItem: [],
    //카트에 담긴 상품의 개수 
    cartCount: 0,
    //카트에 담긴 상품의 전체 가격
    totalPrice: 0,


    //ProductDetail에서 색상변수 selectedColor 사이즈변수 selectedSize 개수 quantity 총가격 totalprice
    //상품을 장바구니에 담는 메서드
    onAddCart: (product) => {
        //장바구니 정보를 가져옴
        const cart = get().cartItem;

        //장바구니에 같은제품이 있는지 없는지 체크
        //제품의 아이디와 사이즈, 색상 같으면 같은제품 아이디와 사이즈가 색상 다르면 다른제품
        //3개다 비교하는게 코드가 길어져거  3가지로 key를 만들어서 비교
        const existing = cart.find((item) => item.key === product.key)

        //새롭게 담을 카트 변수
        let updateCart;
        //같은제품이 있으면 카트에서 수량값만 하나 올라가게 
        if (existing) {
            updateCart = cart.map((item) =>
                item.key === product.key ?
                    { ...item, count: item.count + product.count } : item
            )
        } else {
            updateCart = [...cart, { ...product }]
        }
        set({
            cartItem: updateCart,
            cartCount: updateCart.length,
            totalPrice: get().onTotal(updateCart)
        })

    },
    //카트에 담긴 아이템들의 가격의 합을 누적해서 구해주는 메서드
    onTotal: (cart) => {
        //배열의 데이터를 누적해서 구하기 .reduce((누적값,현재값),초기값)
        return cart.reduce((acc, cur) => acc + cur.price * cur.count, 0);
    },
    onUpdateQuantity: (key, type) => {
        const cart = get().cartItem;

        const updateCart = cart.map((item) => {
            if (item.key === key) {
                if (type === "minus" && item.count > 1) {
                    return { ...item, count: item.count - 1 };
                }
                if (type === "plus") {
                    return { ...item, count: item.count + 1 };
                }
            }
            return item;
        });

        set({
            cartItem: updateCart,
            totalPrice: get().onTotal(updateCart),
        });
    },
    onRemoveItem: (id, size) => {
        const cart = get().cartItem;

        const updateCart = cart.filter(
            (item) => !(item.id === id && item.size === size)
        );

        set({
            cartItem: updateCart,
            cartCount: updateCart.length,
            totalPrice: get().onTotal(updateCart),
        });
    },
}))