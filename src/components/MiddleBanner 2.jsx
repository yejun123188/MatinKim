import React from 'react'
import { Link } from 'react-router-dom'

export default function MiddleBanner() {
    return (
        <section
            className='inner'
            style={{
                marginTop: '-60px',
                marginBottom: '-60px',
                position: 'relative',
                zIndex: 2,
            }}
        >
            <Link to="/newin">
                <img
                    src="/images/banner-img/summer-banner.jpg"
                    alt="썸머 배너"
                />
            </Link>
        </section>
    )
}