import React, { useEffect, useState } from 'react'
import { useProductStore } from '../store/useProductStore'
import { Link, useLocation } from 'react-router-dom';

export default function Filter({ colorCount }) {
    const { menus, onColorCode } = useProductStore();
    const location = useLocation();
    const currentMainCategory = decodeURIComponent(location.pathname.split('/')[1] || '').toUpperCase();
    const [openShopMenus, setOpenShopMenus] = useState({});
    const [openSections, setOpenSections] = useState({
        CATEGORY: false,
        PRICE: false,
        'COLOR OPTIONS': false,
        'SIZE OPTIONS': false
    });

    useEffect(() => {
        setOpenShopMenus((prev) => {
            const nextState = Object.fromEntries(
                menus.map((menu) => {
                    const isCurrentCategory = menu.name.toUpperCase() === currentMainCategory;
                    const hasPrevState = Object.prototype.hasOwnProperty.call(prev, menu.name);

                    return [menu.name, isCurrentCategory ? true : (hasPrevState ? prev[menu.name] : false)];
                })
            );

            return nextState;
        });

        setOpenSections({
            CATEGORY: false,
            PRICE: false,
            'COLOR OPTIONS': false,
            'SIZE OPTIONS': false
        });
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
                                <strong className='filter-main-label'>{menu.name}</strong>
                                <span className='filter-toggle-icon'>{(openShopMenus[menu.name] ?? true) ? '−' : '+'}</span>
                            </button>
                            <div className={`filter-panel ${(openShopMenus[menu.name] ?? true) ? 'is-open' : ''}`}>
                                <ul className="sub-menu">
                                    {menu.subMenu.map((m, id) => (
                                        <li key={id} className='sub-menu-item'>
                                            <Link to={m.link}>
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
                                {colorCount.map((color, id) => (
                                    <p key={id} className='color-item'>
                                        <strong
                                            className='color-chip'
                                            style={{
                                                ...getColorStyle(color.color)
                                            }}>
                                        </strong>
                                    </p>
                                ))}
                            </div>
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
                </div>
            </div>
        </div>
    )
}
