import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import "./scss/FindIdResult.scss";

export default function FindIdResult() {
    const navigate = useNavigate();
    const location = useLocation();

    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const { findType, name, phone } = location.state || {};

    useEffect(() => {
        const fetchMember = async () => {
            if (!name) {
                alert("잘못된 접근입니다.");
                navigate("/findid");
                return;
            }

            try {
                const usersRef = collection(db, "users");

                let q;

                if (findType === "phone") {
                    q = query(
                        usersRef,
                        where("name", "==", name),
                        where("phone", "==", phone)
                    );
                } else {
                    q = query(
                        usersRef,
                        where("name", "==", name)
                    );
                }

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setMember(querySnapshot.docs[0].data());
                } else {
                    alert("회원 정보를 찾을 수 없습니다.");
                    navigate("/findid");
                }
            } catch (error) {
                console.error("아이디 찾기 결과 오류:", error);
                alert("아이디 찾기 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [findType, name, phone, navigate]);

    if (loading) {
        return <div className="find-id-result-page">불러오는 중...</div>;
    }

    if (!member) return null;

    return (
        <section className="find-id-result-page">
            <div className="find-id-result-box">
                <h2>아이디 찾기</h2>

                <div className="result-text">
                    <h3>고객님 아이디 찾기가 완료 되었습니다.</h3>
                    <p>다음정보로 가입된 아이디가 총 1개 있습니다.</p>
                </div>

                <div className="user-info">
                    <p>
                        이름: <span>{member.name}</span>
                    </p>
                    <p>
                        휴대폰번호: <span>{member.phone}</span>
                    </p>
                </div>

                <div className="id-result">
                    <label>
                        <input type="radio" checked readOnly />
                        <span>
                            {member.userId}
                            <em>
                                {" "}
                                ( 개인회원, {member.joinDate || "2026-04-06"} 가입 )
                            </em>
                        </span>
                    </label>
                </div>

                <div className="result-buttons">
                    <button type="button" onClick={() => navigate("/login")}>
                        로그인
                    </button>

                    <button
                        type="button"
                        className="black"
                        onClick={() => navigate("/findpw")}
                    >
                        비밀번호 찾기
                    </button>
                </div>
            </div>
        </section>
    );
}