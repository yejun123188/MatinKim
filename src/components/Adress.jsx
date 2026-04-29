import React, { useEffect, useState } from "react";
import "./scss/Adress.scss";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";
import { db } from "../firebase/firebase";

export default function Adress() {
  const navigate = useNavigate();

  const [checkedItems, setCheckedItems] = useState([]);

  const { addressList, onFetchAddress, onSetDefaultAddress } = useAuthStore();

  // 주소 불러오기
  useEffect(() => {
    onFetchAddress();
  }, [onFetchAddress]);

  // 개별 체크
  const handleChecked = (address) => {
    const key = address.id;

    setCheckedItems((prev) => {
      if (prev.includes(key)) {
        return prev.filter((i) => i !== key);
      }
      return [...prev, key];
    });
  };

  // 전체 체크
  const handleAllChecked = (e) => {
    if (e.target.checked) {
      const allIds = addressList.map((item) => item.id);
      setCheckedItems(allIds);
    } else {
      setCheckedItems([]);
    }
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (checkedItems.length === 0) return;

    const resultConfirm = window.confirm("선택한 배송지를 삭제하시겠습니까?");
    if (!resultConfirm) return;

    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const promises = checkedItems.map((id) =>
        deleteDoc(doc(db, "users", user.uid, "addresses", id)),
      );

      await Promise.all(promises);

      await onFetchAddress();
      setCheckedItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  // 기본 배송지 변경
  const handleSetDefault = async (selectedId) => {
    const resultConfirm = window.confirm("기본 배송지로 설정하시겠습니까?");
    if (!resultConfirm) return;

    try {
      await onSetDefaultAddress(selectedId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="address-wrap">
      <div className="address-top">
        <label>
          <input
            type="checkbox"
            onChange={handleAllChecked}
            checked={
              checkedItems.length === addressList.length &&
              addressList.length > 0
            }
          />
          전체선택
        </label>
      </div>

      <div className="address-middle">
        <div className="left">
          {addressList.map((item) => (
            <div className="address-item" key={item.id}>
              <div className="item-left">
                <input
                  type="checkbox"
                  onChange={() => handleChecked(item)}
                  checked={checkedItems.includes(item.id)}
                />

                <div className="content">
                  {item.isDefault && <div className="show">기본배송지</div>}

                  <ul className="address-list">
                    <li>
                      <span>배송지명</span>
                      {item.name}
                    </li>
                    <li>
                      <span>수령인</span>
                      {item.receiver}
                    </li>
                    <li>
                      <span>주소</span>
                      {item.address}
                    </li>
                    <li>
                      <span>연락처</span>
                      {item.phone}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="item-right">
                {!item.isDefault && (
                  <button onClick={() => handleSetDefault(item.id)}>
                    기본배송지 설정
                  </button>
                )}
                <button
                  onClick={() => navigate("/userinfo/address", { state: item })}
                >
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="address-bottom">
        <ul className="explain-list">
          <li>•배송 주소록은 최대 10개까지 등록할 수 있습니다.</li>
          <li>•최근 배송지 기준으로 자동 업데이트 됩니다.</li>
          <li>•기본 배송지는 1개만 저장됩니다.</li>
        </ul>

        <div className="button">
          <button onClick={() => navigate("/userinfo/address")}>
            배송지 등록
          </button>
          <button onClick={handleDeleteSelected}>선택삭제</button>
        </div>
      </div>
    </div>
  );
}
