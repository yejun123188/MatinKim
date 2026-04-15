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
        console.log(products, allColors)
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
        console.log(menuList);
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
        console.log("베수트", bestItems);
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
        console.log("신상", newItems);
    }

}))