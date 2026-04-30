import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import "./scss/AddressPopup.scss"

export default function AddressPopup({ onClose, onSelect }) {
    const { addressList, onFetchAddress } = useAuthStore();
    useEffect(() => {
        onFetchAddress()
    }, [])
    const handleSelet = (address) => {
        onSelect(address);
        onClose();
    }
    return (
        <div>
            <div className="modal-overlay" >
                <div className="modal-box" >
                    <div className="modal-header">
                        <h3>배송주소록</h3>
                        <button onClick={onClose}>✕</button>
                    </div>

                    <ul className="address-list">
                        {addressList.length === 0 && <p>저장된 배송지가 없습니다.</p>}
                        {addressList.map((addr) => (
                            <li key={addr.id} className="address-item">
                                <div className="address-info">
                                    <strong>{addr.name}</strong>
                                    {addr.isDefault && <span className="badge">기본</span>}
                                    <p>{addr.receiver} · {addr.phone}</p>
                                    <p>{addr.address} {addr.detail}</p>
                                    <p>({addr.zipcode})</p>
                                </div>
                                <button onClick={() => handleSelet(addr)} >선택</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
