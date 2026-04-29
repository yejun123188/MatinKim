const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const SHOES_SUBCATEGORY_KEYWORDS = {
    '스니커즈': ['sneakers', 'maryjane'],
    '로퍼': ['loafer', 'bloafer'],
    '샌들': ['sandal', 'slide']
};

const SHOES_SUBCATEGORY_PRIORITY = ['스니커즈', '로퍼', '샌들'];

export const getShoesSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    SHOES_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = SHOES_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByShoeSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getShoesSubCategory(product) === selectedCategory);
};

export const buildShoesSubCategoryOptions = (products = []) =>
    SHOES_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getShoesSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
