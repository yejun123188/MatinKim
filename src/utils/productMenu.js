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

const categoryRouteMap = {
  ACCESSORIES: "other",
};

const getMainMenuName = (category1 = "") =>
  categoryRouteMap[category1.toUpperCase()] || category1.toLowerCase();

export const getProductMainCategory = (routeCategory = "") =>
  routeCategory.toLowerCase() === "other" ? "accessories" : routeCategory.toLowerCase();

export const buildProductMenus = (products = []) => {
  const menuList = [];

  products.forEach(({ category1, category2 }) => {
    if (!category1 || !category2) return;

    const mainName = getMainMenuName(category1);
    const subName = subMenuMap[category2] || category2;
    const subKey = category2.toUpperCase();
    const subLabel = subKey === "OUTERWEARS" ? "OUTER" : subKey;
    const subRoute = urlMap[category2] || category2.toLowerCase();

    let mainMenu = menuList.find((menu) => menu.name === mainName);

    if (!mainMenu) {
      mainMenu = { name: mainName, link: `/${mainName}`, subMenu: [] };
      menuList.push(mainMenu);
    }

    const hasSubMenu = mainMenu.subMenu.some((menu) => menu.link === `/${mainName}/${subRoute}`);

    if (!hasSubMenu) {
      mainMenu.subMenu.push({
        name: subName,
        subName: subLabel,
        link: `/${mainName}/${subRoute}`,
      });
    }
  });

  return menuList.filter((menu) => menu.subMenu.length > 0);
};
