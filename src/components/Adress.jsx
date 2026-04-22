import React from 'react'
import "./scss/Adress.scss"
import { useNavigate } from 'react-router-dom'

const addData = [
    {
        "id": 1,
        "name": "집",
        "receiver": "마뗑킴",
        "address": "서울 종로구 낙산성곽서길 99-2 201동",
        "phone": "010-6444-2173",
        "isDefault": true
    },
    {
        "id": 2,
        "name": "회사",
        "receiver": "마뗑킴",
        "address": "서울 서초구 잠원동 잠원로 221-124",
        "phone": "010-6444-2173",
        "isDefault": false
    }
]
export default function Adress() {
    const navigate = useNavigate();
    return (
        <div className='address-wrap'>
            <div className="address-top">
                <label><input type="checkbox" /> 전체선택</label>
            </div>
            <div className="address-middle">

                <div className="left">
                    {addData.map((item) => (
                        <div className="address-item" key={item.id}>
                            <div className="item-left">
                                <input type="checkbox" />

                                <div className="content">
                                    {item.isDefault && <div className="show">기본배송지</div>}

                                    <ul className="address-list">
                                        <li><span>배송지명</span>{item.name}</li>
                                        <li><span>수령인</span>{item.receiver}</li>
                                        <li><span>주소</span>{item.address}</li>
                                        <li><span>연락처</span>{item.phone}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="item-right">
                                {!item.isDefault && <button>기본배송지 설정</button>}
                                <button>수정</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="address-bottom">
                <ul className="explain-list">
                    <li>•배송 주소록은 최대 10개까지 등록할 수 있으며, 별도로 등록하지 않을 경우 최근 배송 주소록 기준으로 자동 업데이트 됩니다.</li>
                    <li>•자동 업데이트를 원하지 않을 경우 주소록 고정 선택을 선택하시면 선택된 주소록은 업데이트 대상에서 제외됩니다.</li>
                    <li>•기본 배송지는 1개만 저장됩니다. 다른 배송지를 기본 배송지로 설정하시면 기본 배송지가 변경됩니다.</li>
                </ul>
                <div className="button">
                    <button onClick={() => navigate("/address/new")}>배송지 등록</button>
                    <button>선택삭제</button>
                </div>
            </div>
        </div>
    )
}
