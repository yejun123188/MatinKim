import React from 'react'
import "./scss/sectiontitle.scss"

export default function SectionTitle({ title, subtitle }) {
    return (
        <div className="section-title">
            <h2>{title}</h2>
            <p className='sub-title'>{subtitle}</p>
        </div>
    )
}
