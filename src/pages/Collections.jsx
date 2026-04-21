import React from 'react'
import collections from "../data/collections"
import ACSubpage from './ACSubpage'
import SubSwiper from '../components/SubSwiper'
import "../components/scss/SubSwiper.scss"
const slides = [
    { src: "/images/sub-collection-about/collection-slider1.png", text: "No Rush", title: "MATIN KIM  ", subtitle: "NCT NENO 2026 SU COLLECTION", link: "/collections/1" },
    { src: "/images/sub-collection-about/collection-slider3.png", text: "HOUSE, HAUS", title: "MATIN KIM ", subtitle: "LIZ 2026 S/S COLLECTION", link: "/collections/3" },
    { src: "/images/sub-collection-about/collection-slider2.png", text: "Record1", title: "MATIN KIM ", subtitle: "NINGNING 2025 WT COLLECTION", link: "/collections/8" }
]

export default function Collections() {
    return (
        <section className='sub-section col-section'>
            <SubSwiper slides={slides} />
            <ACSubpage title={"COLLECTIONS"} data={collections} />
        </section>
    )
}
