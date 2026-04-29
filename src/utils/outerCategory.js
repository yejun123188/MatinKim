const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '');

export const OUTER_SUBCATEGORY_KEYWORDS = {
    '후드': ['후드', '후드티', '후드집업', 'hood', 'hoody', 'hoodie', 'hooded', 'hoodzipup'],
    '점퍼': ['점퍼', '바람막이', '윈드브레이커', 'jumper', 'windbreaker', 'windbreak', 'breaker'],
    '자켓': ['자켓', '재킷', '블레이저', 'jacket', 'blazer'],
    '가디건': ['가디건', '니트가디건', 'cardigan', 'knitcardigan'],
    '베스트': ['베스트', '조끼', 'vest']
};

const OUTER_SUBCATEGORY_PRIORITY = ['후드', '점퍼', '자켓', '가디건', '베스트'];

export const getOuterSubCategory = (product = {}) => {
    const productName = normalizeKeyword(product.title || product.name || '');

    if (!productName) return '';

    let bestMatch = null;

    OUTER_SUBCATEGORY_PRIORITY.forEach((category, priority) => {
        const keywords = OUTER_SUBCATEGORY_KEYWORDS[category] || [];

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

export const filterProductsByOuterSubCategory = (products = [], selectedCategory = '') => {
    if (!selectedCategory) return products;

    return products.filter((product) => getOuterSubCategory(product) === selectedCategory);
};

export const buildOuterSubCategoryOptions = (products = []) =>
    OUTER_SUBCATEGORY_PRIORITY.map((category) => ({
        category,
        count: products.filter((product) => getOuterSubCategory(product) === category).length
    })).filter(({ count }) => count > 0);
