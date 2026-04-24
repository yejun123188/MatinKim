const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const OTHERS_SUBCATEGORY_KEYWORDS = {
    '양말': ['sock', 'socks'],
    '벨트': ['belt'],
    '악세서리': ['charm', 'keyring', 'strap', 'chain']
};

const OTHERS_SUBCATEGORY_PRIORITY = ['양말', '벨트', '악세서리'];

export const getOthersSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    OTHERS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = OTHERS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByOthersSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getOthersSubCategory(product) === selectedCategory);
};

export const buildOthersSubCategoryOptions = (products = []) =>
    OTHERS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getOthersSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
