import React, { useEffect, useState } from 'react'
import { useProductStore } from '../store/useProductStore'
import { Link, useLocation } from 'react-router-dom';
import PriceRange from './PriceRange';

export default function Filter({
    colorCount,
    onPriceChange,
    minPrice = 0,
    maxPrice = 1000,
    selectedColor = '',
    onColorChange,
    sizeOptions = [],
    selectedSize = '',
    onSizeChange
}) {
    const INITIAL_VISIBLE_COLORS = 18;
    const { menus, onColorCode } = useProductStore();
    const location = useLocation();
    const currentMainCategory = decodeURIComponent(location.pathname.split('/')[1] || '').toUpperCase();
    const currentSubCategory = decodeURIComponent(location.pathname.split('/')[2] || '').toUpperCase();
    const [openShopMenus, setOpenShopMenus] = useState({});
    const [showAllColors, setShowAllColors] = useState(false);
    const [openSections, setOpenSections] = useState({
        CATEGORY: true,
        PRICE: true,
        'COLOR OPTIONS': true,
        'SIZE OPTIONS': true
    });

    useEffect(() => {
        setOpenShopMenus((prev) => {
            const nextState = Object.fromEntries(
                menus.map((menu) => {
                    const hasPrevState = Object.prototype.hasOwnProperty.call(prev, menu.name);

                    return [menu.name, hasPrevState ? prev[menu.name] : true];
                })
            );

            return nextState;
        });

        setOpenSections({
            CATEGORY: true,
            PRICE: true,
            'COLOR OPTIONS': true,
            'SIZE OPTIONS': true
        });
        setShowAllColors(false);
    }, [menus, currentMainCategory]);

    const toggleShopMenu = (menuName) => {
        setOpenShopMenus((prev) => ({
            ...prev,
            [menuName]: !(prev[menuName] ?? true)
        }));
    };

    const toggleSection = (sectionName) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const getColorStyle = (colorName) => {
        const colorValue = onColorCode(colorName);
        return colorValue.includes("gradient")
            ? { background: colorValue }
            : { backgroundColor: colorValue };
    };
    const handlePrice = ({ minPrice, maxPrice }) => {
        if (!onPriceChange) return;
        onPriceChange({
            min: minPrice,
            max: maxPrice
        })
    };

    const handleSizeToggle = (size) => {
        if (!onSizeChange) return;
        onSizeChange(selectedSize === size ? '' : size);
    };

    const handleColorToggle = (color) => {
        if (!onColorChange) return;
        onColorChange(selectedColor === color ? '' : color);
    };

    const visibleColors = showAllColors ? colorCount : colorCount.slice(0, INITIAL_VISIBLE_COLORS);
    const hasMoreColors = colorCount.length > INITIAL_VISIBLE_COLORS;

    return (
        <div className='filter-wrap'>
            <div className='filter-section shop'>
                <h2 className='filter-title'>SHOP</h2>
                <ul className="filter-main-menu">
                    {menus.map((menu, id) => (
                        <li key={id} className='filter-main-item'>
                            <button
                                type="button"
                                className='filter-toggle filter-main-toggle'
                                onClick={() => toggleShopMenu(menu.name)}
                                aria-expanded={openShopMenus[menu.name] ?? true}
                            >
                                <strong className={`filter-main-label ${currentMainCategory === menu.name.toUpperCase() ? 'is-active' : ''}`}>
                                    {menu.name}
                                </strong>
                                <span className='filter-toggle-icon'>{(openShopMenus[menu.name] ?? true) ? '−' : '+'}</span>
                            </button>
                            <div className={`filter-panel ${(openShopMenus[menu.name] ?? true) ? 'is-open' : ''}`}>
                                <ul className="sub-menu">
                                    {menu.subMenu.map((m, id) => (
                                        <li key={id} className='sub-menu-item'>
                                            <Link
                                                to={m.link}
                                                className={currentSubCategory === decodeURIComponent(m.link.split('/')[2] || '').toUpperCase() ? 'is-active' : ''}
                                            >
                                                <p>{m.name}</p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='shop-by'>
                <h2 className='filter-title'>SHOP-BY</h2>
                <div className='filter-section category'>
                    <button
                        type="button"
                        className='filter-toggle'
                        onClick={() => toggleSection('CATEGORY')}
                        aria-expanded={openSections.CATEGORY}
                    >
                        <h3 className='filter-subtitle'>CATEGORY</h3>
                        <span className='filter-toggle-icon'>{openSections.CATEGORY ? '−' : '+'}</span>
                    </button>
                </div>
                <div className='filter-section price'>
                    <button
                        type="button"
                        className='filter-toggle'
                        onClick={() => toggleSection('PRICE')}
                        aria-expanded={openSections.PRICE}
                    >
                        <h3 className='filter-subtitle'>PRICE</h3>
                        <span className='filter-toggle-icon'>{openSections.PRICE ? '−' : '+'}</span>
                    </button>
                    <div className={`filter-panel ${openSections.PRICE ? 'is-open' : ''}`}>
                        <div className='price-range-box'>
                            <PriceRange
                                min={minPrice}
                                max={maxPrice}
                                step={1000}
                                onSearch={handlePrice}
                            />
                        </div>
                    </div>
                </div>
                <div className='filter-section color-list-wrap'>
                    <button
                        type="button"
                        className='filter-toggle'
                        onClick={() => toggleSection('COLOR OPTIONS')}
                        aria-expanded={openSections['COLOR OPTIONS']}
                    >
                        <h3 className='filter-subtitle'>COLOR OPTIONS</h3>
                        <span className='filter-toggle-icon'>{openSections['COLOR OPTIONS'] ? '−' : '+'}</span>
                    </button>
                    <div className={`filter-panel ${openSections['COLOR OPTIONS'] ? 'is-open' : ''}`}>
                        <div className='color-list-box'>
                            <div className='color'>
                                {visibleColors.map((color, id) => (
                                    <button
                                        key={id}
                                        type="button"
                                        className={`color-item ${selectedColor === color.color ? 'is-active' : ''}`}
                                        onClick={() => handleColorToggle(color.color)}
                                        aria-label={`${color.color} 필터`}
                                    >
                                        <strong
                                            className='color-chip'
                                            style={{
                                                ...getColorStyle(color.color)
                                            }}>
                                        </strong>
                                    </button>
                                ))}
                            </div>
                            {hasMoreColors && (
                                <button
                                    type="button"
                                    className='color-more-btn'
                                    onClick={() => setShowAllColors((prev) => !prev)}
                                >
                                    {showAllColors ? '접기' : '+ 더보기'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className='filter-section size'>
                    <button
                        type="button"
                        className='filter-toggle'
                        onClick={() => toggleSection('SIZE OPTIONS')}
                        aria-expanded={openSections['SIZE OPTIONS']}
                    >
                        <h3 className='filter-subtitle'>SIZE OPTIONS</h3>
                        <span className='filter-toggle-icon'>{openSections['SIZE OPTIONS'] ? '−' : '+'}</span>
                    </button>
                    <div className={`filter-panel ${openSections['SIZE OPTIONS'] ? 'is-open' : ''}`}>
                        <div className='size-list-box'>
                            {sizeOptions.length > 0 ? (
                                <div className='size-option-list'>
                                    {sizeOptions.map(({ size, count }) => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`size-option-item ${selectedSize === size ? 'is-active' : ''}`}
                                            onClick={() => handleSizeToggle(size)}
                                        >
                                            <span className='size-option-label'>{size}</span>
                                            <span className='size-option-count'>({count})</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className='size-empty-text'>현재 상품에 표시할 사이즈가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
