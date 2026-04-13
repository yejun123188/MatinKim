import React from 'react'
import { Link } from 'react-router-dom'

const topmenus = [
  { key: "shop", label: "SHOP" },
  { key: "project", label: "PROJECT" },
  { key: "collections", label: "COLLECTIONS" },
  { key: "about", label: "ABOUT" }
]

export default function Header() {
  return (
    <header>
      <div className="inner">
        <div className="header-left">
          <h1><Link to={"/"}><img src="" alt="" />마뗑킴</Link></h1>
          <nav>
            <ul className="main-menu">
              {topmenus.map((menu, id) => (
                <li key={id}><Link to={`/${menu.key}`}>{menu.label}</Link ></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <ul className="gnb-list">
            <li><input type="text" placeholder='SEARCH' /></li>
            <li><Link to={"/cart"}><img src="" alt="" />장바구니 이미지</Link></li>
            <li><Link to={"/member"}><img src="" alt="" />유저 이미지</Link></li>
          </ul>
        </div>
      </div>
    </header>
  )
}
