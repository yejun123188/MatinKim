import React from 'react'
import { useProductStore } from '../store/useProductStore'
import { Link } from 'react-router-dom';

export default function Filter({ colorCount }) {
    const { menus } = useProductStore();
    console.log("mene", menus)
    return (
        <div className='filter-wrap'>
            <div className='shop'>
                <h2>shop</h2>
                <ul className="filter-main-menu">
                    {menus.map((menu, id) => (
                        <li key={id}>
                            <strong>{menu.name}</strong>
                            <ul className="sub-menu">
                                {menu.subMenu.map((m, id) => (
                                    <li key={id}>
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
                <div className='category'>
                    <h2>category</h2>
                </div>
                <div className='price'>
                    <h2>price</h2>
                </div>
                <div className='color-list-wrap'>
                    <h2>color</h2>
                    <div>
                        <h3>컬러영역</h3>
                        <div className='color'>
                            {colorCount.map((color, id) => (
                                <p key={id}>
                                    <strong
                                        style={{
                                            backgroundColor: color.color,
                                            display: "block",
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%"
                                        }}>
                                        {/* {color.color} */}
                                    </strong>
                                    {/* <span>({color.count})</span> */}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='size'>
                    <h2>size</h2>
                </div>
            </div>
        </div>
    )
}
