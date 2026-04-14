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

export const useProductStore = create((set, get) => ({
    //상품~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //상품을 저장할 배열
    items: [],
    //데이터 파일 불러오기
    onFetchItem: async () => {
        const existing = get().items
        //만약 데이터가 이미 존재하면 아무것도 하지 않고 반환하지롱
        if (existing.length > 0) return;
        //데이터가 존재하면 items배열에 products를 넣어
        set({ items: products })
        console.log(products)

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


        //색상안나오는 것도 있어서 매치하는 거 해야할듯
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