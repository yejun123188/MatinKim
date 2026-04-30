export const RECENT_VIEWED_PRODUCTS_KEY = "recentViewedProducts";
export const RECENT_VIEWED_PRODUCTS_LIMIT = 20;

export const getRecentViewedProducts = () => {
  try {
    const savedProducts = localStorage.getItem(RECENT_VIEWED_PRODUCTS_KEY);
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];

    return Array.isArray(parsedProducts) ? parsedProducts : [];
  } catch {
    return [];
  }
};

export const setRecentViewedProducts = (products) => {
  localStorage.setItem(
    RECENT_VIEWED_PRODUCTS_KEY,
    JSON.stringify(products.slice(0, RECENT_VIEWED_PRODUCTS_LIMIT)),
  );
};

export const addRecentViewedProduct = (product) => {
  if (!product?.id) return;

  const viewedProduct = {
    id: product.id,
    name: product.name,
    img: product.mainImg || product.hoverImg || "",
    price: product.discountRate > 0 ? product.discountPrice : product.price,
    originalPrice: product.discountRate > 0 ? product.price : null,
    colors: product.colors || [],
    sizes: product.sizes || [],
  };

  const currentProducts = getRecentViewedProducts();
  const nextProducts = [
    viewedProduct,
    ...currentProducts.filter((item) => item.id !== viewedProduct.id),
  ];

  setRecentViewedProducts(nextProducts);
};
