const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const DRESSES_SUBCATEGORY_KEYWORDS = {
    '롱드레스': ['long', 'dress']
};

const DRESSES_SUBCATEGORY_PRIORITY = ['롱드레스'];

export const getDressesSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    DRESSES_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = DRESSES_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByDressesSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getDressesSubCategory(product) === selectedCategory);
};

export const buildDressesSubCategoryOptions = (products = []) =>
    DRESSES_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getDressesSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
