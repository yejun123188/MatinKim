const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const WALLETS_SUBCATEGORY_KEYWORDS = {
    '지갑': ['wallet', 'puff', 'quilt'],
    '카드지갑': ['card', 'cardwallet']
};

const WALLETS_SUBCATEGORY_PRIORITY = ['지갑', '카드지갑'];

export const getWalletsSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    WALLETS_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = WALLETS_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByWalletsSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getWalletsSubCategory(product) === selectedCategory);
};

export const buildWalletsSubCategoryOptions = (products = []) =>
    WALLETS_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getWalletsSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
