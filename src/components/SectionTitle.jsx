import React, { useEffect, useRef, useState } from 'react'
import "./scss/sectiontitle.scss"

export default function SectionTitle({ title, subtitle }) {
    const titleRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.2,
            }
        )

        if (titleRef.current) {
            observer.observe(titleRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={titleRef}
            className={`section-title ${isVisible ? 'is-visible' : ''}`}
        >
            <h2>{title}</h2>
            <p className="sub-title">{subtitle}</p>
        </div>
    )
}