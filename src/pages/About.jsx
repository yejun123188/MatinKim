import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Brand from './Brand'
import "./scss/About.scss"

export default function About() {
    return (
        <section className='sub-section about'>
            <div className="button-box inner">

                <ul className="button-list">
                    <li><Link to={"brand"} >BRAND & INFO</Link ></li>
                    <li><Link to={"stockist"}>STOCKIST</Link></li>
                </ul>
            </div>
            <Outlet></Outlet>
        </section>
    )
}
