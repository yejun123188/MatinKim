import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import projects from "../data/projects.json"
import "./scss/ProjectDetail.scss"

export default function ProjectDetail() {
    const { id } = useParams();

    const [post, setPost] = useState();

    useEffect(() => {
        if (!id || id.length === 0) return;
        const findpost = projects.find((item) => item.collectionId === Number(id))
        setPost(findpost)
    }, [id])


    if (!post) return <div>로딩중...</div>
    return (
        <div className='inner project-detail'>
            <h3>{post.title}</h3>
            <h1>{post.subtitle}</h1>
            <p style={{ whiteSpace: "pre-line" }}>{post.text}</p>

            <ul className="collection-list">
                {post.sections.map((section) => (
                    <li key={section.id}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${section.columns}, 1fr)`,
                                gap: "20px",
                            }}
                        >
                            {section.groups.map((item, i) => {
                                if (item.type === "img") {
                                    if (typeof item.url === "object") {
                                        return (
                                            <picture key={i}>
                                                <source media="(max-width: 768px)" srcSet={item.url.mobile} />
                                                <img src={item.url.pc} alt="" style={{ width: "100%" }} />
                                            </picture>
                                        );
                                    }

                                    return (
                                        <img key={i} src={item.url} alt="" style={{ width: "100%" }} />
                                    );
                                }
                            })}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="button">
                <button>뒤로백하기 버튼</button>
            </div>
        </div>
    )
}
