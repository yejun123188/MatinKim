const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const HAIR_SUBCATEGORY_KEYWORDS = {
    '헤어핀': ['pin', 'bobby'],
    '반다나': ['bandana']
};

const HAIR_SUBCATEGORY_PRIORITY = ['헤어핀', '반다나'];

export const getHairSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    HAIR_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = HAIR_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByHairSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getHairSubCategory(product) === selectedCategory);
};

export const buildHairSubCategoryOptions = (products = []) =>
    HAIR_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getHairSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
