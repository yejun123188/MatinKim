const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const BOTTOMS_SUBCATEGORY_KEYWORDS = {
    '팬츠': ['팬츠', 'pants', 'cargo'],
    '데님': ['데님', 'denim', 'jeans'],
    '숏팬츠': ['반바지', 'shorts', 'bermuda'],
    '스커트': ['스커트', 'skirt']
};

const BOTTOMS_SUBCATEGORY_PRIORITY = ['팬츠', '데님', '숏팬츠', '스커트'];

export const getBottomsSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    BOTTOMS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = BOTTOMS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByBottomsSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getBottomsSubCategory(product) === selectedCategory);
};

export const buildBottomsSubCategoryOptions = (products = []) =>
    BOTTOMS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getBottomsSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
