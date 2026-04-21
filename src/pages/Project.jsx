import React from 'react'
import projects from "../data/projects.json"
import ACSubpage from './ACSubpage'
import SubSwiper from '../components/SubSwiper'
import "../components/scss/SubSwiper.scss"
const slides = [
    { src: "/images/sub-collection-about/project-slider1.png", text: "Matin Kim x CASETiFY", title: "MATIN MIN  X", subtitle: "Collaborations", link: "/projects/1" },
    { src: "/images/sub-collection-about/project-slider2.png", text: "Matin Kim x  Peaches", title: "MATIN MIN  X", subtitle: "Collaborations", link: "/projects/8" },
    { src: "/images/sub-collection-about/project-slider3.png", text: "Matin Kim x  KYOKA", title: "MATIN MIN  X", subtitle: "Collaborations", link: "/projects/3" }
]

export default function Project() {
    return (
        <section className='sub-section pro-section'>
            <SubSwiper slides={slides} />
            <ACSubpage title={"PROJECTS"} data={projects} />
        </section>
    )
}
