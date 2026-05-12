import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'  // ✅ 추가
import { useAuthStore } from '../store/useAuthStore'
import "./scss/AddressPopup.scss"

export default function AddressPopup({ onClose, onSelect }) {
    const { addressList, onFetchAddress } = useAuthStore();

    useEffect(() => {
        onFetchAddress();
    }, []);

    // 스크롤 막기
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleSelet = (address) => {
        onSelect(address);
        onClose();
    };

    //createPortal로 body에 직접 렌더링
    return createPortal(
        <div className="modal-overlay-add" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div className="modal-header">
                    <h3>배송주소록</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                <ul className="address-list">
                    {addressList.length === 0 && <p>저장된 배송지가 없습니다.</p>}
                    {addressList.map((addr) => (
                        <li key={addr.id} className="address-item">
                            <div className="address-info">
                                <div className='my-address'>  <strong>{addr.name}</strong> {addr.isDefault && <span className="badge">기본배송지</span>}
                                </div>
                                <p>{addr.receiver} · {addr.phone}</p>
                                <p>{addr.address} {addr.detail}</p>
                                <p>({addr.zipcode})</p>
                            </div>
                            <button onClick={() => handleSelet(addr)}>선택</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>,
        document.body  // body에 직접 붙임
    );
}