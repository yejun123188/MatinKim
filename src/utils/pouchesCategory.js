const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const POUCHES_SUBCATEGORY_KEYWORDS = {
    '케이스': ['case'],
    '파우치': ['pouch', 'holder', 'bag']
};

const POUCHES_SUBCATEGORY_PRIORITY = ['케이스', '파우치'];

export const getPouchesSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    POUCHES_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = POUCHES_SUBCATEGORY_KEYWORDS[category] || [];

        keywords.forEach((keyword) => {
            const matchIndex = productName.indexOf(normalizeKeyword(keyword));

            if (matchIndex === -1) return;

            if (
                !bestMatch ||
                matchIndex < bestMatch.matchIndex ||
                (matchIndex === bestMatch.matchIndex && priority < bestMatch.priority)
            ) {
                bestMatch = {
                    category,
                    matchIndex,
                    priority
                };
            }
        });
    });

    return bestMatch?.category || '';
};

export const filterProductsByPouchesSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getPouchesSubCategory(product) === selectedCategory);
};

export const buildPouchesSubCategoryOptions = (products = []) =>
    POUCHES_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getPouchesSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
