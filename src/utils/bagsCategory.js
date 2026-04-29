const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const BAGS_SUBCATEGORY_KEYWORDS = {
    '숄더백': ['shoulder', 'shoulderbag'],
    '토트백': ['tote'],
    '클러치': ['clutch', 'baguette'],
    '에코백': ['eco', 'ecobag']
};

const BAGS_SUBCATEGORY_PRIORITY = ['숄더백', '토트백', '클러치', '에코백'];

export const getBagsSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    BAGS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = BAGS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByBagsSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getBagsSubCategory(product) === selectedCategory);
};

export const buildBagsSubCategoryOptions = (products = []) =>
    BAGS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getBagsSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
