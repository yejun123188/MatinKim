import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./scss/AddressRegister.scss";
import { useAuthStore } from "../store/useAuthStore";
import { db } from "../firebase/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export default function AddressRegister() {
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state;

    const { addAddress } = useAuthStore();

    const [form, setForm] = useState({
        name: "",
        receiver: "",
        zipcode: "",
        address: "",
        detail: "",
        phone1: "02",
        phone2: "",
        phone3: "",
        mobile1: "010",
        mobile2: "",
        mobile3: "",
        isDefault: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            const phoneSplit = editData.phone?.split("-") || ["010", "", ""];

            setForm({
                name: editData.name || "",
                receiver: editData.receiver || "",
                zipcode: "",
                address: editData.address || "",
                detail: "",
                phone1: "02",
                phone2: "",
                phone3: "",
                mobile1: phoneSplit[0],
                mobile2: phoneSplit[1],
                mobile3: phoneSplit[2],
                isDefault: editData.isDefault || false
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const address = data.roadAddress || data.jibunAddress;

                setForm((prev) => ({
                    ...prev,
                    zipcode: data.zonecode,
                    address: address
                }));

                setTimeout(() => {
                    document.querySelector(".detail-input")?.focus();
                }, 100);
            }
        }).open();
    };

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "배송지명을 입력해주세요";
        if (!form.receiver.trim()) newErrors.receiver = "받는 사람을 입력해주세요";
        if (!form.zipcode) newErrors.zipcode = "주소를 입력해주세요";
        if (!form.mobile2 || !form.mobile3) newErrors.mobile = "휴대전화를 입력해주세요";

        setErrors(newErrors);

        setTimeout(() => {
            document.querySelector(".error")?.focus();
        }, 0);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const data = {
            name: form.name,
            receiver: form.receiver,
            address: form.address + " " + form.detail,
            phone: `${form.mobile1}-${form.mobile2}-${form.mobile3}`,
            isDefault: form.isDefault
        };

        try {
            const { user } = useAuthStore.getState();
            if (!user) return;

            const ref = collection(db, "users", user.uid, "addresses");
            const snap = await getDocs(ref);

            if (!editData && snap.size >= 10) {
                alert("배송지는 최대 10개까지 등록할 수 있습니다.");
                return;
            }
            if (editData) {
                await updateDoc(
                    doc(db, "users", user.uid, "addresses", editData.id),
                    data
                );
            } else {
                await addAddress(data);
            }

            navigate("/userInfo", { state: { menu: "배송지 관리" } });

        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitCancel = () => {
        const result = window.confirm(`${editData ? "수정" : "등록"}을 취소하시겠습니까?`);
        if (result) {
            navigate("/userInfo", { state: { menu: "배송지 관리" } });
        }
    };

    return (
        <section className='sub-section add-r'>
            <div className="inner">
                <h2>{editData ? "배송지 수정" : "배송지 등록"}</h2>

                <div className='address-register-wrap'>
                    <div className="form-row">
                        <p>배송지명<em>*</em></p>
                        <input name="name" value={form.name} onChange={handleChange} className={errors.name ? "error" : ""} />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>

                    <div className="form-row">
                        <p>받는 사람<em>*</em></p>
                        <input name="receiver" value={form.receiver} onChange={handleChange} className={errors.receiver ? "error" : ""} />
                        {errors.receiver && <p className="error-text">{errors.receiver}</p>}
                    </div>

                    <div className="form-row address">
                        <p>주소<em>*</em></p>
                        <div className="address-box">
                            <div className="zip">
                                <input value={form.zipcode} readOnly className={errors.zipcode ? "error" : ""} />
                                <button type="button" onClick={openPostcode}>주소검색</button>
                            </div>

                            <input value={form.address} readOnly />

                            <input
                                name="detail"
                                value={form.detail}
                                onChange={handleChange}
                                className="detail-input"
                            />
                        </div>
                        {errors.zipcode && <p className="error-text">{errors.zipcode}</p>}
                    </div>

                    <div className="form-row phone">
                        <p>휴대폰 번호<em>*</em></p>
                        <div className="phone-box">
                            <select name="mobile1" value={form.mobile1} onChange={handleChange}>
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                            </select>
                            <input name="mobile2" value={form.mobile2} onChange={handleChange} className={errors.mobile ? "error" : ""} />
                            <input name="mobile3" value={form.mobile3} onChange={handleChange} className={errors.mobile ? "error" : ""} />
                        </div>
                        {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                    </div>

                    <div className="check">
                        <label>
                            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                            기본 배송지로 저장
                        </label>
                    </div>
                </div>

                <div className="button-wrap">
                    <button className="submit" onClick={handleSubmit}>
                        {editData ? "수정완료" : "등록"}
                    </button>
                    <button className="cancel" onClick={handleSubmitCancel}>
                        취소
                    </button>
                </div>
            </div>
        </section>
    );
}