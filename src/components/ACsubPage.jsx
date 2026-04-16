import React from 'react'
import collection from "../data/collections"

import { Link } from 'react-router-dom'
export default function ACsubPage({ title }) {
    return (

        <div className='inner collections'>
            <h2 className="collections-title">{title}</h2>

            <div className="list-box">
                <ul className="collection-list">
                    {collection.map((c, id) => (

                        <li key={id}>
                            <Link to={`/${title.toLowerCase()}/${c.collectionId}`}>
                                <div className="img-box">
                                    <img src={c.thumbnail} alt="{c.title}" />
                                </div>
                                <div className="text-box">
                                    <h5>{c.title}</h5>
                                    <p className='sub-title'>
                                        {c.subtitle}
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
