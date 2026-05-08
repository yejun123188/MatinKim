import { BAGS_SUBCATEGORY_KEYWORDS } from './bagsCategory';
import { BOTTOMS_SUBCATEGORY_KEYWORDS } from './bottomsCategory';
import { DRESSES_SUBCATEGORY_KEYWORDS } from './dressesCategory';
import { HAIR_SUBCATEGORY_KEYWORDS } from './hairCategory';
import { HATS_SUBCATEGORY_KEYWORDS } from './hatsCategory';
import { NECKWEAR_SUBCATEGORY_KEYWORDS } from './neckwearCategory';
import { OTHERS_SUBCATEGORY_KEYWORDS } from './othersCategory';
import { OUTER_SUBCATEGORY_KEYWORDS } from './outerCategory';
import { POUCHES_SUBCATEGORY_KEYWORDS } from './pouchesCategory';
import { SHOES_SUBCATEGORY_KEYWORDS } from './shoesCategory';
import { TOPS_SUBCATEGORY_KEYWORDS } from './topsCategory';
import { WALLETS_SUBCATEGORY_KEYWORDS } from './walletsCategory';

const normalizeKeyword = (value = '') =>
    String(value)
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();

export const ALL_CATEGORY_KEYWORDS = {
    ...BAGS_SUBCATEGORY_KEYWORDS,
    ...BOTTOMS_SUBCATEGORY_KEYWORDS,
    ...DRESSES_SUBCATEGORY_KEYWORDS,
    ...HAIR_SUBCATEGORY_KEYWORDS,
    ...HATS_SUBCATEGORY_KEYWORDS,
    ...NECKWEAR_SUBCATEGORY_KEYWORDS,
    ...OTHERS_SUBCATEGORY_KEYWORDS,
    ...OUTER_SUBCATEGORY_KEYWORDS,
    ...POUCHES_SUBCATEGORY_KEYWORDS,
    ...SHOES_SUBCATEGORY_KEYWORDS,
    ...TOPS_SUBCATEGORY_KEYWORDS,
    ...WALLETS_SUBCATEGORY_KEYWORDS,
};

// 마뗑킴 실제 category2 기준
const CATEGORY_ALIAS_MAP = {
    바지: {
        category2: ['bottoms'],
        terms: ['pants', 'bottoms', 'jeans', 'denim', 'cargo', 'slacks', 'trousers'],
        requireCategoryMatch: true,
    },

    청바지: {
        category2: ['bottoms'],
        terms: ['jeans', 'denim'],
        requireCategoryMatch: true,
        requireTextMatch: true,
    },

    상의: {
        category2: ['tops'],
        terms: ['top', 'tops', 'shirt', 'tee', 't-shirt', 'blouse', 'hoodie', 'knit', 'sweater'],
        requireCategoryMatch: true,
    },

    모자: {
        category2: ['hats&caps'],
        terms: ['hat', 'cap', 'caps', 'beanie', 'bucket'],
        requireCategoryMatch: true,
    },

    가방: {
        category2: ['bags'],
        terms: [
            'bag',
            'bags',
            'tote',
            'shoulder',
            'backpack',
            'clutch',
            'crossbody',
            'cross-body',
            'messenger',
        ],
        requireCategoryMatch: true,
    },

    지갑: {
        category2: ['wallets'],
        terms: ['wallet', 'cardwallet', 'card-wallet', 'cardholder', 'card-holder'],
        requireCategoryMatch: true,
    },

    신발: {
        category2: ['shoes'],
        terms: ['shoe', 'shoes', 'sneaker', 'sneakers', 'boots', 'loafer', 'loafers'],
        requireCategoryMatch: true,
    },

    아우터: {
        category2: ['outerwears'],
        terms: [
            'outer',
            'outerwear',
            'jumper',
            'jacket',
            'coat',
            'blazer',
            'windbreaker',
            'parka',
        ],
        requireCategoryMatch: true,
    },

    원피스: {
        category2: ['dresses'],
        terms: ['dress', 'dresses'],
        requireCategoryMatch: true,
    }
};

const PRODUCT_SEARCH_DICTIONARY = {
    클래식: ['classic'],
    로고: ['logo'],
    티: ['tee', 't-shirt'],
    티셔츠: ['tee', 't-shirt'],
    반팔: ['short-sleeve', 'shortsleeve', 'tee', 't-shirt'],
    긴팔: ['long-sleeve', 'longsleeve'],
    롱슬리브: ['long-sleeve', 'longsleeve'],
    셔츠: ['shirt'],
    블라우스: ['blouse'],
    후드: ['hood', 'hoodie'],
    후디: ['hoodie'],
    후드집업: ['hoodie', 'zip-up', 'zipup'],
    맨투맨: ['sweatshirt', 'pullover'],
    니트: ['knit'],
    스웨터: ['sweater'],
    가디건: ['cardigan'],
    데님: ['denim'],
    팬츠: ['pants'],
    슬랙스: ['slacks', 'trousers'],
    카고: ['cargo'],
    카고팬츠: ['cargo', 'pants'],
    스커트: ['skirt'],
    미니스커트: ['mini', 'skirt'],
    원피스: ['dress'],
    드레스: ['dress'],
    점퍼: ['jumper'],
    자켓: ['jacket'],
    재킷: ['jacket'],
    코트: ['coat'],
    블레이저: ['blazer'],
    가방: ['bag'],
    크로스백: ['crossbody', 'cross-body'],
    숄더백: ['shoulder', 'bag'],
    백팩: ['backpack'],
    토트백: ['tote', 'bag'],
    클러치: ['clutch'],
    지갑: ['wallet'],
    카드지갑: ['cardwallet', 'cardholder'],
    볼캡: ['cap'],
    캡: ['cap'],
    비니: ['beanie'],
    버킷햇: ['bucket', 'hat'],
    운동화: ['sneaker'],
    부츠: ['boots'],
    로퍼: ['loafer'],
    검정: ['black'],
    블랙: ['black'],
    흰색: ['white'],
    화이트: ['white'],
    아이보리: ['ivory'],
    회색: ['grey', 'gray'],
    그레이: ['grey', 'gray'],
    베이지: ['beige'],
    카키: ['khaki'],
    브라운: ['brown'],
    핑크: ['pink'],
    레드: ['red'],
    네이비: ['navy'],
    블루: ['blue'],
    그린: ['green'],
};

const trimKeywords = (keywords = []) =>
    keywords
        .map((keyword) => normalizeKeyword(keyword))
        .filter(Boolean);

const findAlias = (word) => {
    const normalized = normalizeKeyword(word);

    return Object.entries(CATEGORY_ALIAS_MAP).find(
        ([key]) => normalizeKeyword(key) === normalized
    )?.[1];
};

export const convertKoreanToEnglish = (koreanWord) => {
    const normalizedWord = normalizeKeyword(koreanWord);

    const alias = findAlias(normalizedWord);
    if (alias) {
        return alias.terms;
    }

    if (PRODUCT_SEARCH_DICTIONARY[normalizedWord]) {
        return PRODUCT_SEARCH_DICTIONARY[normalizedWord];
    }

    for (const [korean, englishKeywords] of Object.entries(ALL_CATEGORY_KEYWORDS)) {
        if (normalizeKeyword(korean) === normalizedWord) {
            return trimKeywords(englishKeywords);
        }
    }

    return [normalizedWord];
};

export const expandSearchQuery = (query) => {
    const words = String(query)
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    return words.map((word) => {
        const normalizedWord = normalizeKeyword(word);
        const alias = findAlias(normalizedWord);

        const expandedWords = alias
            ? [normalizedWord, ...alias.terms]
            : [normalizedWord, ...convertKoreanToEnglish(normalizedWord)];

        return {
            words: Array.from(new Set(trimKeywords(expandedWords))),
            category2: alias?.category2 || [],
            requireCategoryMatch: alias?.requireCategoryMatch || false,
            requireTextMatch: alias?.requireTextMatch || false,
        };
    });
};