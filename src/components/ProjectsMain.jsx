import React from 'react'
import SectionTitle from './SectionTitle'
import "./scss/projectsMain.scss"
import { Link } from 'react-router-dom'
import Project from '../pages/Project'

export default function ProjectsMain() {
    return (
        <section className='projects'>
            <div className="inner2">
                <SectionTitle title="PROJECTS" subtitle="This season's favorites" />
                {/* 연결필요 */}
                <Link>
                    <div className="project-list">
                        <div className="card card-1">
                            <img src="./images/main-projects/project1.png" alt="card1" />
                        </div>
                        <div className="card card-2">
                            <video src="./videos/main-projects/project1.mp4" autoPlay muted loop playsInline />
                        </div>
                        <div className="card card-3">
                            <img src="./images/main-projects/project2.png" alt="card1" />
                        </div>
                        <div className="card card-4">
                            <video src="./videos/main-projects/project2.mp4" autoPlay muted loop playsInline />
                        </div>
                        <div className="card card-5">
                            <video src="./videos/main-projects/project3.mp4" autoPlay muted loop playsInline />
                        </div>
                        <div className="card card-6">
                            <video src="./videos/main-projects/project4.mp4" autoPlay muted loop playsInline />
                        </div>
                    </div>
                </Link>
            </div>
        </section >
    )
}
