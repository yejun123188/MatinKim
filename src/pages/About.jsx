import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Brand from './Brand'
import "./scss/About.scss"

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);
    const [btnactive, setBtnActive] = useState(true);
    return (
        <section className='sub-section about'>
            <div className="button-box inner">

                <ul className="button-list">
                    <li className={btnactive ? "active" : ""} onClick={() => setBtnActive(true)}><Link to={"brand"} >BRAND & INFO</Link ></li>
                    <li className={btnactive ? "" : "active"} onClick={() => setBtnActive(false)}><Link to={"stockist"}>STOCKIST</Link></li>
                </ul>
            </div>
            <Outlet></Outlet>
        </section>
    )
}
