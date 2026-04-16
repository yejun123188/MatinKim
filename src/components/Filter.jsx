import React from 'react'
import { useProductStore } from '../store/useProductStore'
import { Link } from 'react-router-dom';

export default function Filter({ colorCount }) {
    const { menus, onColorCode } = useProductStore();
    console.log("mene", menus)

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
                            <strong className='filter-main-label'>{menu.name}</strong>
                            <ul className="sub-menu">
                                {menu.subMenu.map((m, id) => (
                                    <li key={id} className='sub-menu-item'>
                                        <Link to={m.link}>
                                            <p>{m.name}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='shop-by'>
                <h2 className='filter-title'>SHOP-BY</h2>
                <div className='filter-section category'>
                    <h3 className='filter-subtitle'>CATEGORY</h3>
                </div>
                <div className='filter-section price'>
                    <h3 className='filter-subtitle'>PRICE</h3>
                </div>
                <div className='filter-section color-list-wrap'>
                    <h3 className='filter-subtitle'>COLOR OPTIONS</h3>
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
                <div className='filter-section size'>
                    <h3 className='filter-subtitle'>SIZE OPTIONS</h3>
                </div>
            </div>
        </div>
    )
}
