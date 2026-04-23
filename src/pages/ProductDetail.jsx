import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/useProductStore';
import "./scss/productDetail.scss";

const TAB_ITEMS = ["SIZE GUIDE", "DETAILS", "DELIVERY"];
const RELATED_PER_PAGE = 10;
const PAGE_BUTTON_LIMIT = 10;
const THUMBNAILS_PER_VIEW = 5;

const formatCategory = (value = '') => value.replace(/_/g, ' ').toUpperCase();
const COLOR_NAME_KO = {
    "LIGHT BEIGE": "라이트 베이지",
    "CREAM": "크림",
    "DARK BROWN": "다크 브라운",
    "BLUE": "블루",
    "LIGHT GREY": "라이트 그레이",
    "CHARCOAL": "차콜",
    "WHITE": "화이트",
    "BLACK": "블랙",
    "DARK GREY": "다크 그레이",
    "PINK": "핑크",
    "MINT": "민트",
    "IVORY": "아이보리",
    "BEIGE": "베이지",
    "GREY": "그레이",
    "STRONG BLACK": "스트롱 블랙",
    "BROWN": "브라운",
    "KHAKI": "카키",
    "NAVY": "네이비",
    "LIGHT BLUE": "라이트 블루",
    "MIX": "믹스",
    "KHAKI BROWN": "카키 브라운",
    "BURGUNDY": "버건디",
    "LILAC": "라일락",
    "OLIVE": "올리브",
    "SMOKE BLUE": "스모크 블루",
    "COCOA": "코코아",
    "LIGHT KHAKI": "라이트 카키",
    "RED": "레드",
    "DARK NAVY": "다크 네이비",
    "SKY": "스카이",
    "POWDER BLUE": "파우더 블루",
    "LIGHT YELLOW": "라이트 옐로우",
    "CAMEL": "카멜",
    "BUTTER": "버터",
    "DARK BEIGE": "다크 베이지",
    "PURPLE": "퍼플",
    "LIGHT GREEN": "라이트 그린",
    "LIGHT ORANGE": "라이트 오렌지",
    "LIME": "라임",
    "TURQUISE BLUE": "터키즈 블루",
    "PEACH": "피치",
    "YELLOW": "옐로우",
    "KHAKI BEIGE": "카키 베이지",
    "LIGHT PINK": "라이트 핑크",
    "SMOKE PINK": "스모크 핑크",
    "GREEN": "그린",
    "OFF WHITE": "오프화이트",
    "ORANGE": "오렌지",
    "INDIAN PINK": "인디언 핑크",
    "SILVER": "실버",
    "WINE": "와인",
    "DARK SILVER": "다크 실버",
    "DARK GREEN": "다크 그린",
    "GOLD": "골드",
    "VIOLET": "바이올렛"
};

const formatOptionLabel = (value = '') =>
    value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const formatColorLabelKo = (value = '') => COLOR_NAME_KO[value] || value;

// 같은 상품의 다른 컬러 페이지를 찾기 위해 상품명에서 컬러 suffix를 제거
const getProductBaseName = (item) => {
    if (!item?.name) return '';

    const primaryColor = item.colors?.[0];
    const colorSuffix = primaryColor ? ` IN ${primaryColor}` : '';

    return colorSuffix && item.name.endsWith(colorSuffix)
        ? item.name.slice(0, -colorSuffix.length)
        : item.name;
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { items, onFetchItem, onColorCode } = useProductStore();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [thumbStartIndex, setThumbStartIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('SIZE GUIDE');
    const [relatedPage, setRelatedPage] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomImageIndex, setZoomImageIndex] = useState(0);

    // 상세 진입 시 전역 상품 목록이 비어 있으면 한 번만 불러오기
    useEffect(() => {
        if (items.length === 0) onFetchItem();
    }, [items.length, onFetchItem]);

    const product = useMemo(
        () => items.find((item) => item.id === id),
        [items, id]
    );
    // 현재 상품과 같은 이름 그룹의 컬러별 상세 페이지 찾기
    const colorProductMap = useMemo(() => {
        if (!product) return {};

        const baseName = getProductBaseName(product);

        return items.reduce((acc, item) => {
            if (getProductBaseName(item) !== baseName) return acc;

            const itemPrimaryColor = item.colors?.[0];
            if (itemPrimaryColor) {
                acc[itemPrimaryColor] = item;
            }

            return acc;
        }, {});
    }, [items, product]);
    // 상품 전환 버튼 - 전체 상품 배열 기준으로 다음 상품 페이지로 이동
    const nextProductId = useMemo(() => {
        if (!product || items.length === 0) return null;

        const currentIndex = items.findIndex((item) => item.id === product.id);
        if (currentIndex === -1) return null;

        const nextIndex = (currentIndex + 1) % items.length;
        return items[nextIndex]?.id || null;
    }, [items, product]);
    const isProductSoldOut = Boolean(
        product &&
        Array.isArray(product.soldout) &&
        product.soldout.length > 0 &&
        product.soldout.every(Boolean)
    );

    // 상품이 바뀌면 상세 페이지의 모든 로컬 UI 상태를 초기화
    useEffect(() => {
        if (!product) return;
        setSelectedImageIndex(0);
        setThumbStartIndex(0);
        setSelectedColor(product.colors?.[0] || '');
        setSelectedSize(product.sizes?.find((_, index) => !product.soldout?.[index]) || product.sizes?.[0] || '');
        setQuantity(1);
        setActiveTab('SIZE GUIDE');
        setRelatedPage(1);
        setIsZoomOpen(false);
        setZoomImageIndex(0);
        window.scrollTo(0, 0);
    }, [product]);

    // 확대 모달이 열려 있을 때만 스크롤 잠금과 ESC 닫기를 활성화
    useEffect(() => {
        if (!isZoomOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsZoomOpen(false);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isZoomOpen]);

    // 상세 이미지 목록은 hover 이미지를 제외하고 main 이미지를 앞에 고정해 구성
    const detailImages = useMemo(() => {
        if (!product) return [];

        const filteredImages = (product.detailImages || []).filter((image) => image && image !== product.hoverImg);
        const galleryImages = filteredImages.length > 0 ? filteredImages : [product.mainImg].filter(Boolean);

        if (product.mainImg && !galleryImages.includes(product.mainImg)) {
            return [product.mainImg, ...galleryImages];
        }

        return galleryImages;
    }, [product]);
    const selectedImage = detailImages[selectedImageIndex] || product?.mainImg || '';
    const zoomSelectedImage = detailImages[zoomImageIndex] || selectedImage;

    const visibleThumbs = detailImages.slice(thumbStartIndex, thumbStartIndex + THUMBNAILS_PER_VIEW);
    const canThumbPrev = thumbStartIndex > 0;
    const canThumbNext = thumbStartIndex + THUMBNAILS_PER_VIEW < detailImages.length;
    const canZoomPrev = zoomImageIndex > 0;
    const canZoomNext = zoomImageIndex < detailImages.length - 1;

    const sizeRows = product?.tabContents?.sizeTable || [];
    const transposedSizeRows = sizeRows.length > 0
        ? sizeRows[0].map((_, columnIndex) => sizeRows.map((row) => row[columnIndex] || ''))
        : [];
    const sizeColumnCount = transposedSizeRows[0]?.length || 0;
    const sizeValueColumnWidth = sizeColumnCount > 1
        ? `${80 / (sizeColumnCount - 1)}%`
        : '80%';
    const deliveryText = product?.tabContents?.DELIVERY || '';
    const detailText = product?.tabContents?.DETAILS || '';

    const relatedProducts = useMemo(() => {
        if (!product) return [];

        return items.filter((item) => (
            item.id !== product.id &&
            (item.category2 === product.category2 || item.category1 === product.category1)
        ));
    }, [items, product]);

    const relatedTotalPages = Math.max(1, Math.ceil(relatedProducts.length / RELATED_PER_PAGE));
    const relatedPageGroup = Math.ceil(relatedPage / PAGE_BUTTON_LIMIT);
    const relatedStartPage = (relatedPageGroup - 1) * PAGE_BUTTON_LIMIT + 1;
    const relatedEndPage = Math.min(relatedStartPage + PAGE_BUTTON_LIMIT - 1, relatedTotalPages);
    const visibleRelatedPages = Array.from(
        { length: Math.max(relatedEndPage - relatedStartPage + 1, 0) },
        (_, index) => relatedStartPage + index
    );
    const visibleRelatedProducts = relatedProducts.slice(
        (relatedPage - 1) * RELATED_PER_PAGE,
        relatedPage * RELATED_PER_PAGE
    );

    // 수량 변경은 1개 미만으로 내려가지 않도록 막음
    const totalPrice = (product?.discountRate > 0 ? product.discountPrice : product?.price || 0) * quantity;
    const originalTotalPrice = (product?.price || 0) * quantity;

    const handleThumbPrev = () => {
        if (!canThumbPrev) return;
        setThumbStartIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleThumbNext = () => {
        if (!canThumbNext) return;
        setThumbStartIndex((prev) => Math.min(prev + 1, detailImages.length - THUMBNAILS_PER_VIEW));
    };

    const handleSelectImage = (index) => {
        setSelectedImageIndex(index);

        // 메인 이미지 변경 시 현재 선택 이미지가 썸네일 영역 안에 보이도록 함께 이동
        if (index < thumbStartIndex) {
            setThumbStartIndex(index);
        }

        if (index >= thumbStartIndex + THUMBNAILS_PER_VIEW) {
            setThumbStartIndex(index - THUMBNAILS_PER_VIEW + 1);
        }
    };

    const handleQuantityChange = (nextValue) => {
        setQuantity(Math.max(1, nextValue));
    };

    const handleBuyNow = () => {
        if (!product || isProductSoldOut) return;

        // 결제 페이지에서는 바로 구매에 필요한 최소 주문 정보만 state로 넘김
        const purchasePrice = product.discountRate > 0 ? product.discountPrice : product.price;

        navigate('/payment', {
            state: {
                orderItems: [
                    {
                        id: product.id,
                        brand: 'MATIN KIM',
                        name: product.name,
                        option: `${selectedColor || product.colors?.[0] || ''} / ${selectedSize || product.sizes?.[0] || ''}`,
                        quantity,
                        price: purchasePrice,
                        image: product.mainImg || product.hoverImg || ''
                    }
                ]
            }
        });
    };

    const handleSwitchProduct = () => {
        if (!nextProductId) return;
        navigate(`/products/${nextProductId}`);
    };

    const handleSelectColor = (color) => {
        const targetProduct = colorProductMap[color];

        if (!targetProduct) return;

        setSelectedColor(color);

        // 컬러 선택은 옵션 변경이 아니라 해당 컬러 상품 상세 페이지로 이동
        if (targetProduct.id !== product?.id) {
            navigate(`/products/${targetProduct.id}`);
        }
    };

    const handleOpenZoom = () => {
        if (!selectedImage) return;
        setZoomImageIndex(selectedImageIndex);
        setIsZoomOpen(true);
    };

    const handleCloseZoom = () => {
        setIsZoomOpen(false);
    };

    const handleZoomPrev = () => {
        if (!canZoomPrev) return;
        setZoomImageIndex((prev) => prev - 1);
    };

    const handleZoomNext = () => {
        if (!canZoomNext) return;
        setZoomImageIndex((prev) => prev + 1);
    };

    const renderTabContent = () => {
        if (activeTab === 'SIZE GUIDE') {
            return (
                <div className='tab-pane size-guide-pane'>

                    {sizeRows.length > 0 && (
                        <div className='size-table-wrap'>
                            <table>
                                <colgroup>
                                    <col style={{ width: '18%' }} />
                                    {Array.from({ length: Math.max(sizeColumnCount - 1, 0) }, (_, index) => (
                                        <col key={`size-col-${index}`} style={{ width: sizeValueColumnWidth }} />
                                    ))}
                                </colgroup>
                                <tbody>
                                    {transposedSizeRows.map((row, rowIndex) => (
                                        <tr key={`${product.id}-size-row-${rowIndex}`}>
                                            {row.map((cell, cellIndex) => (
                                                rowIndex === 0 || cellIndex === 0
                                                    ? <th key={`${product.id}-size-cell-${rowIndex}-${cellIndex}`}>{cell}</th>
                                                    : <td key={`${product.id}-size-cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <p className='tab-note'>
                        (상세 사이즈 치수는 측정 방법과 위치에 따라 1-2cm 오차가 있을 수 있습니다)
                    </p>
                </div>
            );
        }

        if (activeTab === 'DETAILS') {
            return (
                <div className='tab-pane'>
                    <p>{detailText}</p>
                </div>
            );
        }

        return (
            <div className='tab-pane'>
                <p>{deliveryText}</p>
            </div>
        );
    };

    if (!items.length) return <div className='inner product-detail-empty'>로딩중...</div>;

    if (!product) {
        return (
            <div className='inner product-detail-empty'>
                <p>해당 상품을 찾을 수 없습니다.</p>
                <button type="button" onClick={() => navigate(-1)}>이전 페이지로 이동</button>
            </div>
        );
    }

    return (
        <main className='product-detail-page'>
            <div className='inner product-detail-page-inner'>
                <section className='product-detail-hero'>
                    <div className='gallery-column'>
                        <div className='gallery-thumbs'>
                            <button
                                type="button"
                                className='thumb-nav'
                                onClick={handleThumbPrev}
                                disabled={!canThumbPrev}
                                aria-label='이전 이미지'
                            >
                                <img src="/images/pages-icon/top-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            <div className='thumb-track'>
                                {visibleThumbs.map((image, index) => {
                                    const imageIndex = thumbStartIndex + index;

                                    return (
                                        <button
                                            type="button"
                                            key={`${product.id}-thumb-${imageIndex}`}
                                            className={`thumb-item ${selectedImageIndex === imageIndex ? 'is-active' : ''}`}
                                            onClick={() => handleSelectImage(imageIndex)}
                                        >
                                            <img src={image} alt={`${product.name} 썸네일 ${imageIndex + 1}`} />
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                className='thumb-nav'
                                onClick={handleThumbNext}
                                disabled={!canThumbNext}
                                aria-label='다음 이미지'
                            >
                                <img src="/images/pages-icon/bottom-icon.svg" alt="" aria-hidden="true" />
                            </button>
                        </div>

                        <div className='gallery-main'>
                            <button
                                type="button"
                                className='zoom-btn'
                                aria-label='이미지 확대'
                                onClick={handleOpenZoom}
                            >
                                <img src="/images/pages-icon/zoom-in-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            <img src={selectedImage} alt={product.name} />
                            <div className='gallery-bottom-nav'>
                                <button
                                    type="button"
                                    onClick={() => handleSelectImage(Math.max(selectedImageIndex - 1, 0))}
                                    disabled={selectedImageIndex === 0}
                                    aria-label='이전 메인 이미지'
                                >
                                    <img src="/images/pages-icon/prev-icon.svg" alt="" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelectImage(Math.min(selectedImageIndex + 1, detailImages.length - 1))}
                                    disabled={selectedImageIndex === detailImages.length - 1}
                                    aria-label='다음 메인 이미지'
                                >
                                    <img src="/images/pages-icon/next-icon.svg" alt="" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='info-column'>
                        <div className='detail-actions'>
                            <button type="button" aria-label='공유하기'>
                                <img src="/images/pages-icon/share-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label='다음 상품으로 이동'
                                onClick={handleSwitchProduct}
                                disabled={!nextProductId}
                            >
                                <img src="/images/pages-icon/switch-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label='찜하기'
                                className={isLiked ? 'is-active' : ''}
                                onClick={() => setIsLiked((prev) => !prev)}
                            >
                                <img
                                    src={isLiked ? "/images/pages-icon/like-hover-icon.svg" : "/images/pages-icon/like-icon.svg"}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <p className='detail-path'>
                            SHOP <span>|</span> {formatCategory(product.category2)}
                        </p>
                        <h1 className='detail-title'>{product.name}</h1>

                        <ul className='detail-points'>
                            {(product.bullet_points || []).map((point, index) => (
                                <li key={`${product.id}-point-${index}`}>{point}</li>
                            ))}
                        </ul>

                        <div className='detail-total'>
                            <span>Total</span>
                            <div className='detail-total-price'>
                                <strong>{totalPrice.toLocaleString()}원</strong>
                                {product.discountRate > 0 && (
                                    <div className='detail-total-meta'>
                                        <span className='original-price'>{originalTotalPrice.toLocaleString()}원</span>
                                        <span className='discount-rate'>{product.discountRate}%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='option-block'>
                            <div className='option-group'>
                                <p className='option-label'>COLOR</p>
                                <div className='option-grid'>
                                    {product.colors.map((color) => {
                                        const colorValue = onColorCode(color);
                                        const colorStyle = colorValue.includes('gradient')
                                            ? { background: colorValue }
                                            : { backgroundColor: colorValue };
                                        const targetProduct = colorProductMap[color];
                                        const isCurrentColor = product.colors?.[0] === color;
                                        const isUnavailableColor = !targetProduct;

                                        return (
                                            <button
                                                type="button"
                                                key={`${product.id}-color-${color}`}
                                                className={`option-card ${selectedColor === color ? 'is-selected' : ''}`}
                                                onClick={() => handleSelectColor(color)}
                                                disabled={isUnavailableColor}
                                                aria-current={isCurrentColor ? 'page' : undefined}
                                            >
                                                <span className='option-card-top'>
                                                    <span className='option-color-chip' style={colorStyle}></span>
                                                    <strong>{formatColorLabelKo(color)}</strong>
                                                </span>
                                                <span className='option-card-sub'>{color}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className='option-group'>
                                <p className='option-label'>SIZE</p>
                                <div className='option-grid'>
                                    {(product.sizes || []).map((size, index) => {
                                        const isSoldOut = Boolean(product.soldout?.[index]);

                                        return (
                                            <button
                                                type="button"
                                                key={`${product.id}-size-${size}`}
                                                className={`option-card ${selectedSize === size ? 'is-selected' : ''}`}
                                                onClick={() => !isSoldOut && setSelectedSize(size)}
                                                disabled={isSoldOut}
                                            >
                                                <strong>{formatOptionLabel(size)}</strong>
                                                <span className='option-card-sub'>
                                                    {isSoldOut ? 'SOLD OUT' : ''}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className='purchase-row'>
                            <div className='quantity-box'>
                                <button type="button" onClick={() => handleQuantityChange(quantity - 1)} aria-label='수량 감소'>-</button>
                                <span>{quantity}</span>
                                <button type="button" onClick={() => handleQuantityChange(quantity + 1)} aria-label='수량 증가'>+</button>
                            </div>
                            <button type="button" className='cart-btn'>장바구니 담기</button>
                            <button
                                type="button"
                                className={`buy-btn ${isProductSoldOut ? 'is-soldout' : ''}`}
                                disabled={isProductSoldOut}
                                onClick={handleBuyNow}
                            >
                                {isProductSoldOut ? 'SOLD OUT' : '바로 구매하기'}
                                {/* <img src="/images/pages-icon/next-icon.svg" alt="" aria-hidden="true" /> */}
                            </button>
                        </div>
                    </div>
                </section>

                <section className='product-detail-tabs'>
                    <div className='tab-header'>
                        {TAB_ITEMS.map((tab) => (
                            <button
                                type="button"
                                key={tab}
                                className={activeTab === tab ? 'is-active' : ''}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className='tab-content'>
                        {renderTabContent()}
                    </div>
                </section>

                <section className='related-products-section'>
                    <h2>RELATED PRODUCTS</h2>

                    <ul className='related-products-grid'>
                        {visibleRelatedProducts.map((related) => (
                            <ProductCard key={related.id} cate={related} />
                        ))}
                    </ul>

                    {relatedTotalPages > 1 && (
                        <div className='related-pagination'>
                            <button
                                type="button"
                                className='page-btn page-jump'
                                onClick={() => setRelatedPage(Math.max(relatedStartPage - PAGE_BUTTON_LIMIT, 1))}
                                disabled={relatedStartPage === 1}
                                aria-label='10 pages previous'
                            >
                                <img src="/images/pages-icon/first-icon.svg" alt="" />
                            </button>
                            <button
                                type="button"
                                className='page-btn page-arrow'
                                onClick={() => setRelatedPage((prev) => Math.max(prev - 1, 1))}
                                disabled={relatedPage === 1}
                                aria-label='Previous page'
                            >
                                <img src="/images/pages-icon/prev-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            {visibleRelatedPages.map((page) => (
                                <button
                                    type="button"
                                    key={`related-page-${page}`}
                                    className={`page-btn ${relatedPage === page ? 'is-active' : ''}`}
                                    onClick={() => setRelatedPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                className='page-btn page-arrow'
                                onClick={() => setRelatedPage((prev) => Math.min(prev + 1, relatedTotalPages))}
                                disabled={relatedPage === relatedTotalPages}
                                aria-label='Next page'
                            >
                                <img src="/images/pages-icon/next-icon.svg" alt="" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className='page-btn page-jump'
                                onClick={() => setRelatedPage(Math.min(relatedEndPage + 1, relatedTotalPages))}
                                disabled={relatedEndPage === relatedTotalPages}
                                aria-label='10 pages next'
                            >
                                <img src="/images/pages-icon/last-icon.svg" alt="" />
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {isZoomOpen && (
                <div
                    className='image-zoom-modal'
                    role='dialog'
                    aria-modal='true'
                    aria-label={`${product.name} 이미지 확대 보기`}
                    onClick={handleCloseZoom}
                >
                    <div
                        className='image-zoom-modal-content'
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className='image-zoom-nav image-zoom-prev'
                            aria-label='이전 확대 이미지'
                            onClick={handleZoomPrev}
                            disabled={!canZoomPrev}
                        >
                            <img src="/images/pages-icon/prev-icon.svg" alt="" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className='image-zoom-close'
                            aria-label='확대 이미지 닫기'
                            onClick={handleCloseZoom}
                        >
                            ×
                        </button>
                        <img src={zoomSelectedImage} alt={`${product.name} 확대 이미지`} />
                        <button
                            type="button"
                            className='image-zoom-nav image-zoom-next'
                            aria-label='다음 확대 이미지'
                            onClick={handleZoomNext}
                            disabled={!canZoomNext}
                        >
                            <img src="/images/pages-icon/next-icon.svg" alt="" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
