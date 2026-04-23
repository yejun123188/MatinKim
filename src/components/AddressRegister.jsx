import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/AddressRegister.scss";
import { useAuthStore } from "../store/useAuthStore";
export default function AddressRegister() {
    const navigate = useNavigate();



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


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        //입력하면 에러 제거 
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

        if (!form.name.trim()) {
            newErrors.name = "배송지명을 입력해주세요";
        }

        if (!form.receiver.trim()) {
            newErrors.receiver = "받는 사람을 입력해주세요";
        }

        if (!form.zipcode) {
            newErrors.zipcode = "주소를 입력해주세요";
        }

        if (!form.mobile2 || !form.mobile3) {
            newErrors.mobile = "휴대전화를 입력해주세요";
        }

        setErrors(newErrors);


        setTimeout(() => {
            document.querySelector(".error")?.focus();
        }, 0);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        await addAddress({
            name: form.name,
            receiver: form.receiver,
            address: form.address + " " + form.detail,
            phone: `${form.mobile1}-${form.mobile2}-${form.mobile3}`,
            isDefault: form.isDefault
        });

        navigate("/userInfo", { state: { menu: "배송지 관리" } });
    };
    const handleSubmitCancel = () => {
        const result = window.confirm("등록을 취소하시겠습니까?");

        if (result) {
            navigate("/userInfo", { state: { menu: "배송지 관리" } });
        }
    };
    return (
        <section className='sub-section info-sec'>
            <div className="inner">
                <h2>배송지 등록</h2>

                <div className='address-register-wrap'>
                    <div className="form-row">
                        <p>배송지명</p>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? "error" : ""}
                        />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>

                    <div className="form-row">
                        <p>받는 사람</p>
                        <input
                            type="text"
                            name="receiver"
                            value={form.receiver}
                            onChange={handleChange}
                            className={errors.receiver ? "error" : ""}
                        />
                        {errors.receiver && <p className="error-text">{errors.receiver}</p>}
                    </div>

                    <div className="form-row address">
                        <p>주소</p>
                        <div className="address-box">
                            <div className="zip">
                                <input
                                    type="text"
                                    placeholder="우편번호"
                                    value={form.zipcode}
                                    readOnly
                                    className={errors.zipcode ? "error" : ""}
                                />
                                <button type="button" onClick={openPostcode}>
                                    주소검색
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="기본주소"
                                value={form.address}
                                readOnly
                            />

                            <input
                                type="text"
                                placeholder="나머지 주소 (선택 입력 가능)"
                                name="detail"
                                value={form.detail}
                                onChange={handleChange}
                                className="detail-input"
                            />
                        </div>
                        {errors.zipcode && <p className="error-text">{errors.zipcode}</p>}
                    </div>

                    <div className="form-row phone">
                        <p>일반전화</p>
                        <div className="phone-box">
                            <select name="phone1" value={form.phone1} onChange={handleChange}>
                                <option value="02">02</option>
                                <option value="070">070</option>
                            </select>
                            <span>-</span>
                            <input name="phone2" value={form.phone2} onChange={handleChange} />
                            <span>-</span>
                            <input name="phone3" value={form.phone3} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row phone">
                        <p>휴대전화</p>
                        <div className="phone-box">
                            <select name="mobile1" value={form.mobile1} onChange={handleChange}>
                                <option value="010">010</option>
                                <option value="011">011</option>
                            </select>
                            <span>-</span>
                            <input
                                name="mobile2"
                                value={form.mobile2}
                                onChange={handleChange}
                                className={errors.mobile ? "error" : ""}
                            />
                            <span>-</span>
                            <input
                                name="mobile3"
                                value={form.mobile3}
                                onChange={handleChange}
                                className={errors.mobile ? "error" : ""}
                            />
                        </div>
                        {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                    </div>


                    <div className="check">
                        <label>
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={form.isDefault}
                                onChange={handleChange}
                            />
                            기본 배송지로 저장
                        </label>
                    </div>

                </div>

                <div className="button-wrap">
                    <button className="submit" onClick={handleSubmit}>
                        등록
                    </button>

                    <button
                        className="cancel"
                        onClick={() => { handleSubmitCancel() }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </section>
    );
}