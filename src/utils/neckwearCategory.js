const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const NECKWEAR_SUBCATEGORY_KEYWORDS = {
    '머플러': ['muffler'],
    '스카프': ['scarf']
};

const NECKWEAR_SUBCATEGORY_PRIORITY = ['머플러', '스카프'];

export const getNeckwearSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    NECKWEAR_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = NECKWEAR_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByNeckwearSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getNeckwearSubCategory(product) === selectedCategory);
};

export const buildNeckwearSubCategoryOptions = (products = []) =>
    NECKWEAR_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getNeckwearSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
