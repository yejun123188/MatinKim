import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import "./scss/About.scss"

export default function About() {
    const { pathname } = useLocation();
    const isStockist = pathname.endsWith("/stockist");

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <section className='sub-section about'>
            <div className="button-box inner">

                <ul className="button-list">
                    <li className={isStockist ? "" : "active"}><Link to={"brand"} >BRAND & INFO</Link ></li>
                    <li className={isStockist ? "active" : ""}><Link to={"stockist"}>STOCKIST</Link></li>
                </ul>
            </div>
            <div className="about-route-content" key={pathname}>
                <Outlet></Outlet>
            </div>
        </section>
    )
}
