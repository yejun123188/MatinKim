import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { create } from "zustand";
import { auth, db, googleProvider } from "../firebase/firebase";
import { doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";



export const useAuthStore = create((set, get) => ({
    user: null,

    // 🔹 로그인 상태 유지
    initAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                set({ user: null });
                return;
            }

            const providerId = firebaseUser.providerData?.[0]?.providerId;
            const isEmailPasswordUser = providerId === "password";

            // 이메일 인증 안 했으면 로그인 막기
            if (isEmailPasswordUser && !firebaseUser.emailVerified) {
                alert("이메일 인증을 먼저 해주세요!!!");
                await signOut(auth);
                set({ user: null });
                return;
            }

            const userRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                set({ user: userDoc.data() });
            } else {
                const userInfo = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    name: firebaseUser.displayName || "",
                    nickname: "",
                    phone: firebaseUser.phoneNumber || "",
                    profile: "",
                };

                await setDoc(userRef, userInfo);
                set({ user: userInfo });
            }
        });
    },

    // 🔥 회원가입 (아이디 + 이메일 저장)
    onMember: async ({
        userId,
        uName,
        nickname,
        email,
        password,
        phone,
        profile,
        gender,
        birth,
        agreements,
    }) => {
        try {
            // 아이디 중복 체크
            const userIdRef = doc(db, "userIds", userId);
            const userIdSnap = await getDoc(userIdRef);

            if (userIdSnap.exists()) {
                throw new Error("이미 사용 중인 아이디입니다.");
            }

            // Firebase 회원 생성
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // 이메일 인증 발송
            await sendEmailVerification(user);

            // 사용자 정보 저장
            const userRef = doc(db, "users", user.uid);

            const userInfo = {
                uid: user.uid,
                userId,
                name: uName,
                nickname,
                email,
                phone,
                profile,
                gender: gender || "",
                birth: birth || "",
                agreements: agreements || {},
            };

            await setDoc(userRef, userInfo);

            // 🔥 아이디 → 이메일 매핑 저장 (로그인 핵심)
            await setDoc(userIdRef, {
                uid: user.uid,
                email,
            });

            alert("회원가입 성공!");
        } catch (err) {
            console.error("회원가입 에러:", err);
            throw err;
        }
    },

    // 🔹 이메일 로그인 (기본)
    onLogin: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            set({ user: userCredential.user });
            return userCredential.user;
        } catch (err) {
            console.error("이메일 로그인 에러:", err);
            throw err;
        }
    },

    // 🔥 아이디 로그인 (핵심)
    onLoginByUserId: async (userId, password) => {
        try {
            const userIdRef = doc(db, "userIds", userId);
            const userIdSnap = await getDoc(userIdRef);

            if (!userIdSnap.exists()) {
                throw new Error("존재하지 않는 아이디입니다.");
            }

            const { email } = userIdSnap.data();

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const firebaseUser = userCredential.user;

            const userRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                set({ user: userDoc.data() });
                return userDoc.data();
            } else {
                set({ user: firebaseUser });
                return firebaseUser;
            }
        } catch (err) {
            console.error("아이디 로그인 에러:", err);
            throw err;
        }
    },

    // 🔹 구글 로그인
    onGoogleLogin: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            let userInfo;

            if (!userDoc.exists()) {
                userInfo = {
                    uid: user.uid,
                    email: user.email || "",
                    name: user.displayName || "",
                    nickname: "",
                    phone: user.phoneNumber || "",
                    profile: "",
                };

                await setDoc(userRef, userInfo);
            } else {
                userInfo = userDoc.data();
            }

            set({ user: userInfo });
            return userInfo;
        } catch (err) {
            console.error("구글 로그인 에러:", err);
            throw err;
        }
    },
    onAddAddress: async (addressData) => {
        const { user } = get();

        if (!user) {
            alert("로그인이 필요합니다");
            return;
        }

        try {
            const addressRef = collection(db, "users", user.uid, "addresses");

            await addDoc(addressRef, addressData);

            alert("배송지 등록 완료!");
        } catch (err) {
            console.error(err);
        }
    },
    onLogout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (err) {
            console.error("로그아웃 에러:", err);
        }
    },
    userAddress: null, // 기본 배송지
    addressList: [],
    openPostcode: (callback) => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const address = data.roadAddress || data.jibunAddress;

                callback({
                    zipcode: data.zonecode,
                    address,
                });
            }
        }).open({
            popupName: "postcodePopup",
        });
    },
    //  주소 불러오기
    onFetchAddress: async () => {
        const { user } = get();
        if (!user) return;

        const ref = collection(db, "users", user.uid, "addresses");
        const snap = await getDocs(ref);

        let result = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 기본배송지 위로
        result.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

        set({
            addressList: result,
            userAddress: result.find(v => v.isDefault) || result[0] || null
        });
    },

    //  기본배송지 변경
    onSetDefaultAddress: async (selectedId) => {
        const { user } = get();
        if (!user) return;

        const ref = collection(db, "users", user.uid, "addresses");
        const snap = await getDocs(ref);

        const currentDefault = snap.docs.find(d => d.data().isDefault);

        if (currentDefault) {
            await updateDoc(
                doc(db, "users", user.uid, "addresses", currentDefault.id),
                { isDefault: false }
            );
        }

        await updateDoc(
            doc(db, "users", user.uid, "addresses", selectedId),
            { isDefault: true }
        );

        get().onFetchAddress();
    },
    //배송지 수정
    onEditAddress: async (id, addressData) => {
        const { user } = get();
        if (!user) return;

        try {
            const ref = doc(db, "users", user.uid, "addresses", id);
            await updateDoc(ref, addressData);
            alert("배송지 수정 완료!");
        } catch (err) {
            console.error(err);
        }
    },

}))
