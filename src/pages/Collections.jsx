import React from 'react'
import collections from "../data/collections"
import ACSubpage from './ACSubpage'
import SubSwiper from '../components/SubSwiper'

const slides = [
    { src: "/images/sub-collection-about/collection-slider1.png", text: "No Rush" },
    { src: "/images/sub-collection-about/collection-slider3.png", text: "HOUSE, HAUS" },
    { src: "/images/sub-collection-about/collection-slider2.png", text: "Record1" }
]

export default function Collections() {
    return (
        <section className='sub-section'>
            <SubSwiper slides={slides} />
            <ACSubpage title={"COLLECTIONS"} data={collections} />
        </section>
    )
}
