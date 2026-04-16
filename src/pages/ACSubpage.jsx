import React from 'react'
import { Link } from 'react-router-dom'

import "../pages/scss/Collections.scss"

export default function ACSubpage({ title, data }) {
    return (
        <div className='inner collections'>
            <h2 className="collections-title">{title}</h2>

            <div className="list-box">
                <ul className="collection-list">
                    {data.map((c, id) => (

                        <li key={id}>
                            <Link to={`/${title.toLowerCase()}/${c.collectionId}`}>
                                <div className="img-box">
                                    <img src={c.thumbnail} alt={c.title} />
                                </div>
                                <div className="text-box">
                                    <h5>{c.title}</h5>
                                    <p className='sub-title'>
                                        {title === "COLLECTIONS" ? c.subtitle : c.date}
                                    </p>
                                </div>
                            </Link>
                        </li>

                    ))}
                </ul>
            </div>

        </div >
    )
}
