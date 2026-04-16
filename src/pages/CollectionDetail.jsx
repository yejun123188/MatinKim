import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import collection from "../data/collections.json"

import "./scss/CollectionDetail.scss"

export default function CollectionDetail() {
    const { id } = useParams();

    //id갑과 일치하는 컬렉션을 찾아서 뿌려야 함 - id값은 어떤 컬렉션을 선택하느냐에 따라서 계속 변하기 때문에 상태변수를 사용해야겠다
    //id값과 일치하는 컬렉션 찾아서 저장할 변수
    const [post, setPost] = useState();

    useEffect(() => {
        if (!id || id.length === 0) return;
        const findpost = collection.find((item) => item.collectionId === Number(id))
        setPost(findpost)
        // console.log(findpost)
    }, [id])
    if (!post) return <div>loading...</div>;
    return (
        <div className='inner collection-detail'>
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
                            {section.images.map((img, i) => (
                                <img key={i} src={img} alt="" style={{ width: "100%" }} />
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="button">
                <button>뒤로백하기 버튼</button>
            </div>
        </div >
    )
}
