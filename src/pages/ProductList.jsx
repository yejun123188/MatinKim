import React, { useEffect, useState } from 'react'
import { useProductStore } from '../store/useProductStore'
import { useParams } from 'react-router-dom';
import Filter from '../components/Filter';
import ProductCard from '../components/ProductCard';
import "./scss/productList.scss"

const TAG_ROUTE_MAP = {
    sale: "SALE",
    newin: "NEW IN",
    musthave: "MUST HAVE",
    collab: "COLLAB",
    all: "ALL"
};

const TAG_DESCRIPTION_MAP = {
    "SALE": "세일",
    "NEW IN": "신상품",
    "MUST HAVE": "인기상품",
    "COLLAB": "콜라보",
    "ALL": "전체상품"
};

const CATEGORY1_DESCRIPTION_MAP = {
    "CLOTHING": "의류",
    "GOODS": "굿즈",
    "ACCESSORIES": "액세서리"
};

export default function ProductList() {
    const ITEMS_PER_ROW = 4;
    const MAX_VISIBLE_ROWS = 5;
    const ITEMS_PER_PAGE = ITEMS_PER_ROW * MAX_VISIBLE_ROWS;
    const PAGE_BUTTON_LIMIT = 10;

    //주소줄에 있는 파라메터 값 받아서 사용하기
    const params = useParams();
    const mainCate = params.category1;
    const subCategory = params.category2;
    const tagCategory = TAG_ROUTE_MAP[(mainCate || '').toLowerCase()] || null;
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilter, setShowFilter] = useState(true);

    console.log("카테고리", mainCate, subCategory);
    // 상태 가져오기
    const { items, onFetchItem } = useProductStore();

    // 🐱‍🐉@@@@@@@@@@@@@@@@가격 상태 추가
    const [priceRange, setPriceRange] = useState({
        min: 5000,
        max: 1000000
    })

    // 데이터 불러오기
    useEffect(() => {
        if (items.length === 0) onFetchItem();
    }, [items])

    useEffect(() => {
        setCurrentPage(1);
    }, [mainCate, subCategory, sortBy]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);


    //카테고리별 필터링
    // let cateItems = onItemsCategory(category);
    let cateItems = items.filter((item) => {
        if (tagCategory) {
            if (tagCategory === 'ALL') {
                return !(item.price < priceRange.min || item.price > priceRange.max);
            }

            if (tagCategory === 'SALE') {
                if (item.discountRate <= 0) return false;
                return !(item.price < priceRange.min || item.price > priceRange.max);
            }

            if (!Array.isArray(item.tag) || !item.tag.includes(tagCategory)) {
                return false;
            }

            return !(item.price < priceRange.min || item.price > priceRange.max);
        }

        //1.메인 메뉴 카테고리 필터
        if (mainCate && item.category1.toUpperCase() !== mainCate) {
            return false;
        }
        //2. subcategory가 있을 경우 필터
        if (subCategory && item.category2.toUpperCase() !== subCategory) {
            return false;
        }
        // // 🐱‍🐉@@@@@@@@@@@@@@@@가격
        if (item.price < priceRange.min || item.price > priceRange.max) return false
        return true
    })

    // 정렬 로직
    const sortedItems = [...cateItems].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                // NEW IN 태그가 있는 상품을 우선 정렬, 그 다음 ID 기준 내림차순
                const aHasNewIn = a.tag && a.tag.includes('NEW IN');
                const bHasNewIn = b.tag && b.tag.includes('NEW IN');
                if (aHasNewIn && !bHasNewIn) return -1;
                if (!aHasNewIn && bHasNewIn) return 1;
                return b.id - a.id;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.discountPrice - b.discountPrice;
            case 'price-high':
                return b.discountPrice - a.discountPrice;
            case 'popular':
                // MUST HAVE 태그가 있는 상품을 우선 정렬, 그 다음 ID 기준 내림차순
                const aHasMustHave = a.tag && a.tag.includes('MUST HAVE');
                const bHasMustHave = b.tag && b.tag.includes('MUST HAVE');
                if (aHasMustHave && !bHasMustHave) return -1;
                if (!aHasMustHave && bHasMustHave) return 1;
                return b.id - a.id;
            case 'discount':
                return b.discountRate - a.discountRate;
            default:
                return 0;
        }
    });

    // 인기상품 필터링 제거 (정렬에서 우선순위로 처리)
    const filteredItems = sortedItems;
    // if (!items.length) return <div>로딩중...</div>
    console.log("카테고리별: ", filteredItems);
    const colorCount = filteredItems.reduce((acc, item) => {
        item.colors.forEach(color => {
            const exist = acc.find(c => c.color === color);
            if (exist) {
                exist.count += 1;
            }
            else {
                acc.push({ color, count: 1 })
            }
        })
        return acc;
    }, [])

    console.log("칼라", colorCount)
    const subMenuMap = {
        Outerwears: "아우터",
        Tops: "상의",
        Bottoms: "하의",
        Dresses: "드레스",
        Bags: "가방",
        Shoes: "신발",
        Wallets: "지갑",
        "Hats & Caps": "모자",
        Hair: "헤어",
        Neckwear: "넥웨어",
        "Pouches & Cases": "파우치",
        Others: "기타"
    };
    const bannerTitle = tagCategory
        || (subCategory ? (filteredItems[0]?.category2 || decodeURIComponent(subCategory)) : '')
        || (mainCate ? mainCate.toUpperCase() : '');
    const bannerDescription = tagCategory
        ? (TAG_DESCRIPTION_MAP[tagCategory] || tagCategory)
        : subCategory
            ? (subMenuMap[bannerTitle] || bannerTitle)
            : (CATEGORY1_DESCRIPTION_MAP[bannerTitle] || bannerTitle);
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const currentPageGroup = Math.ceil(currentPage / PAGE_BUTTON_LIMIT);
    const startPage = (currentPageGroup - 1) * PAGE_BUTTON_LIMIT + 1;
    const endPage = Math.min(startPage + PAGE_BUTTON_LIMIT - 1, totalPages);
    const visiblePages = Array.from(
        { length: Math.max(endPage - startPage + 1, 0) },
        (_, index) => startPage + index
    );
    const pagedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <main className='product-list-wrap'>
            <div className={`inner ${!showFilter ? 'filter-hidden' : ''}`}>
                <div className={`filter-sidebar ${!showFilter ? 'is-hidden' : ''}`}>
                    <Filter colorCount={colorCount} onPriceChange={setPriceRange} />
                </div>
                <div className={`product-list-wrap ${!showFilter ? 'filter-hidden' : ''}`}>
                    <div className='section-banner'>
                        <img className='banner-img' src="/images/collection/liz/img_liz_00024.jpg" alt={bannerTitle} />
                        <div className="banner-text">
                            <h2 className='banner-name'>{bannerTitle}</h2>
                            <p className='banner-description'>{bannerDescription}</p>
                        </div>
                    </div>
                    <div className='section-bottom'>
                        <div className='filter-controls'>
                            <button
                                type="button"
                                className='filter-toggle-btn'
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                <img src="/images/pages-icon/filter-icon.svg" alt="" aria-hidden="true" />
                                {showFilter ? '필터 숨기기' : '필터 보이기'}
                            </button>
                            <div className='sort-buttons'>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                                    onClick={() => setSortBy('newest')}
                                >
                                    신상품순
                                </button>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                                    onClick={() => setSortBy('name')}
                                >
                                    상품명순
                                </button>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'price-high' ? 'active' : ''}`}
                                    onClick={() => setSortBy('price-high')}
                                >
                                    높은가격순
                                </button>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'price-low' ? 'active' : ''}`}
                                    onClick={() => setSortBy('price-low')}
                                >
                                    낮은가격순
                                </button>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
                                    onClick={() => setSortBy('popular')}
                                >
                                    인기상품순
                                </button>
                                <button
                                    type="button"
                                    className={`sort-btn ${sortBy === 'discount' ? 'active' : ''}`}
                                    onClick={() => setSortBy('discount')}
                                >
                                    할인율높은순
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='product-list'>
                        {/* 상품리스트 */}
                        <ul>
                            {pagedItems.map((cate) => (
                                <ProductCard cate={cate} key={cate.id} />
                            ))}
                        </ul>
                    </div>
                    {/* 페이징 영역 */}
                    {totalPages > 1 && (
                        <div className='pagination'>
                            <button
                                type="button"
                                className='page-btn page-jump'
                                onClick={() => setCurrentPage(Math.max(startPage - PAGE_BUTTON_LIMIT, 1))}
                                disabled={startPage === 1}
                                aria-label='10 pages previous'
                            >
                                <img src="/images/pages-icon/first-icon.svg" alt="" />
                            </button>
                            <button
                                type="button"
                                className='page-btn page-arrow'
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                aria-label='Previous page'
                            >
                                <img src="/images/pages-icon/prev-icon.svg" alt="" />
                            </button>
                            {visiblePages.map((pageNumber) => (
                                <button
                                    type="button"
                                    key={pageNumber}
                                    className={`page-btn ${currentPage === pageNumber ? 'is-active' : ''}`}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                type="button"
                                className='page-btn page-arrow'
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                aria-label='Next page'
                            >
                                <img src="/images/pages-icon/next-icon.svg" alt="" />
                            </button>
                            <button
                                type="button"
                                className='page-btn page-jump'
                                onClick={() => setCurrentPage(Math.min(startPage + PAGE_BUTTON_LIMIT, totalPages))}
                                disabled={endPage === totalPages}
                                aria-label='10 pages next'
                            >
                                <img src="/images/pages-icon/last-icon.svg" alt="" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
