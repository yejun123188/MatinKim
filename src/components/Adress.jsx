import React, { useEffect, useState } from "react";
import "./scss/Adress.scss";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";
import { db } from "../firebase/firebase";

export default function Adress() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const ref = collection(db, "users", user.uid, "addresses");
      const snap = await getDocs(ref);

      let result = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      result.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

      setList(result);
    };

    fetchData();
  }, []);

  const handleSetDefault = async (selectedId) => {
    const resultConfirm = window.confirm("기본 배송지로 설정하시겠습니까?");
    if (!resultConfirm) return;

    const { user } = useAuthStore.getState();
    if (!user) return;

    const ref = collection(db, "users", user.uid, "addresses");
    const snap = await getDocs(ref);

    const currentDefault = snap.docs.find((d) => d.data().isDefault);

    if (currentDefault) {
      await updateDoc(
        doc(db, "users", user.uid, "addresses", currentDefault.id),
        { isDefault: false },
      );
    }

    await updateDoc(doc(db, "users", user.uid, "addresses", selectedId), {
      isDefault: true,
    });

    const newSnap = await getDocs(ref);
    let result = newSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    result.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

    setList(result);
  };

  return (
    <div className="address-wrap">
      <div className="address-top">
        <label>
          <input type="checkbox" /> 전체선택
        </label>
      </div>

      <div className="address-middle">
        <div className="left">
          {list.map((item) => (
            <div className="address-item" key={item.id}>
              <div className="item-left">
                <input type="checkbox" />

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
                <button>수정</button>
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
          <button>선택삭제</button>
        </div>
      </div>
    </div>
  );
}
