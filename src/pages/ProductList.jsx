import React, { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import { Link, useParams } from 'react-router-dom';
import Filter from '../components/Filter';
import ProductCard from '../components/ProductCard';
import "./scss/productList.scss"

export default function ProductList() {
    //주소줄에 있는 파라메터 값 받아서 사용하기
    const params = useParams();
    const mainCate = params.category1;
    const subCategory = params.category2;

    console.log("카테고리", mainCate, subCategory);
    // 상태 가져오기
    const { items, onFetchItem } = useProductStore();

    // 데이터 불러오기
    useEffect(() => {
        if (items.length === 0) onFetchItem();
    }, [items])


    //카테고리별 필터링
    // let cateItems = onItemsCategory(category);
    let cateItems = items.filter((item) => {
        //1.메인 메뉴 카테고리 필터
        if (mainCate && item.category1.toUpperCase() !== mainCate) {
            return false;
        }
        //2. subcategory가 있을 경우 필터
        if (subCategory && item.category2.toUpperCase() !== subCategory) {
            return false;
        }
        return true
    })
    // if (!items.length) return <div>로딩중...</div>
    console.log("카테고리별: ", cateItems);
    const colorCount = cateItems.reduce((acc, item) => {
        item.colors.forEach(color => {
            const exist = acc.find(c => c.color === color);
            if (exist) {
                exist.count += 1;
            }
            else {
                acc.push({ color, count: 1 })
            }
        })
        return acc;
    }, [])

    console.log("칼라", colorCount)


    return (
        <main className='product-list-wrap sub-section'>
            <div className="inner">
                <Filter colorCount={colorCount} />
                <div className="product-list-wrap">
                    <div className='section-top'>
                        {/* 배너 위치 */}
                    </div>
                    <div className='section-bottom'>
                        {/* 버튼 영억 */}
                    </div>
                    <div className='product-list'>
                        {/* 상품리스트 */}
                        <ul>
                            {cateItems.map((cate) => (
                                <ProductCard cate={cate} key={cate.id} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}
