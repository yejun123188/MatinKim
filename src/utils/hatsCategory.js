const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const HATS_SUBCATEGORY_KEYWORDS = {
    '캡': ['cap', 'ball', 'camp'],
    '버킷햇': ['hat', 'bucket'],
    '비니': ['BEANIE']
};

const HATS_SUBCATEGORY_PRIORITY = ['캡', '버킷햇', '비니'];

export const getHatsSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    HATS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = HATS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByHatsSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getHatsSubCategory(product) === selectedCategory);
};

export const buildHatsSubCategoryOptions = (products = []) =>
    HATS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getHatsSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
