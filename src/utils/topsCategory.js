const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const TOPS_SUBCATEGORY_KEYWORDS = {
    '가디건': ['가디건', 'cardigan'],
    '니트': ['니트', '풀오버', 'knit', 'pullover'],
    '후드': ['후디', '후드', 'hoodie', 'hoody', 'hood'],
    '셔츠': ['셔츠', '블라우스', 'shirt', 'blouse']
};

const TOPS_SUBCATEGORY_PRIORITY = ['가디건', '니트', '후드', '셔츠'];

export const getTopsSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    TOPS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = TOPS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByTopsSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getTopsSubCategory(product) === selectedCategory);
};

export const buildTopsSubCategoryOptions = (products = []) =>
    TOPS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getTopsSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
