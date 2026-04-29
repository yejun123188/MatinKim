import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    signInWithCustomToken
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
            const firebaseUser = result.user;

            const googleUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || "구글사용자",
                nickname: firebaseUser.displayName || "구글사용자",
                photoURL: firebaseUser.photoURL || "",
                provider: "google",
            };

            const userRef = doc(db, "people", googleUser.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, googleUser);
                console.log("신규 구글 회원 Firestore 등록 완료");
            } else {
                console.log("기존 구글 회원 Firestore 데이터 있음");
            }

            set({ user: googleUser });

            alert(`${googleUser.nickname}님, 구글 로그인되었습니다.`);
            return googleUser;

        } catch (err) {
            console.error("구글 로그인 오류:", err);
            alert("구글 로그인 실패: " + err.message);
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

    onKakaoLogin: async () => {
        try {
            // 1 카카오 SDK 초기화
            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('415096494840a6ca548a1d48257b2766');
                console.log(' Kakao SDK 초기화 완료');
            }

            // 2 로그인 요청(Promise 변환)
            const authObj = await new Promise((resolve, reject) => {
                window.Kakao.Auth.login({
                    scope: 'profile_nickname, profile_image',
                    success: resolve,
                    fail: reject,
                });
            });
            console.log(' 카카오 로그인 성공:', authObj);


            // 3 사용자 정보 요청 (Promise 기반)
            const res = await window.Kakao.API.request({
                url: '/v2/user/me',
            });
            console.log(' 카카오 사용자 정보:', res);

            // 4 사용자 정보 가공
            const uid = res.id.toString();
            const kakaoUser = {
                uid,
                email: res.kakao_account?.email || '',
                name: res.kakao_account.profile?.nickname || '카카오사용자',
                nickname: res.kakao_account.profile?.nickname || '카카오사용자',
                photoURL: res.kakao_account.profile?.profile_image_url || '',
                provider: 'kakao',
                // createdAt: new Date(),
            };

            // 5 Firestore에 저장
            // const userRef = doc(db, 'users', uid);
            const userRef = doc(db, 'people', uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, kakaoUser);
                console.log(' 신규 카카오 회원 Firestore에 등록 완료');
            } else {
                console.log('기존 카카오 회원 Firestore 데이터 있음');
            }

            // 6 Zustand 상태 업데이트
            set({ user: kakaoUser });

            alert(`${kakaoUser.nickname}님, 카카오 로그인되었습니다.`);
            return kakaoUser;
        } catch (err) {
            console.error(' 카카오 로그인 중 오류:', err);
            alert('카카오 로그인 실패: ' + err.message);
        }
    },
    onNaverLogin: async () => {
        try {
            console.log("네이버 로그인 시작");

            if (!window.naver || !window.naver.LoginWithNaverId) {
                throw new Error("네이버 SDK가 로드되지 않았습니다.");
            }

            const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
            const REDIRECT_URI = `${window.location.origin}/naverCallback.html`;

            let loginBox = document.getElementById("naverIdLogin");

            if (!loginBox) {
                loginBox = document.createElement("div");
                loginBox.id = "naverIdLogin";
                loginBox.style.display = "none";
                document.body.appendChild(loginBox);
            }

            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: CLIENT_ID,
                callbackUrl: REDIRECT_URI,
                isPopup: true,
                loginButton: {
                    color: "green",
                    type: 3,
                    height: 60,
                },
                callbackHandle: true,
            });

            naverLogin.init();

            const profile = await new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    window.removeEventListener("message", handler);
                    reject(new Error("네이버 로그인 시간 초과"));
                }, 120000);

                function handler(e) {
                    if (e.origin !== window.location.origin) return;

                    if (e.data?.type === "NAVER_LOGIN_SUCCESS") {
                        clearTimeout(timer);
                        window.removeEventListener("message", handler);
                        resolve(e.data.profile);
                    }

                    if (e.data?.type === "NAVER_LOGIN_FAIL") {
                        clearTimeout(timer);
                        window.removeEventListener("message", handler);
                        reject(new Error(e.data.message));
                    }
                }

                window.addEventListener("message", handler);

                setTimeout(() => {
                    const loginBtn = document.querySelector("#naverIdLogin a");

                    if (!loginBtn) {
                        reject(new Error("네이버 로그인 버튼 생성 실패"));
                        return;
                    }

                    loginBtn.click();
                }, 300);
            });

            const uid = "naver_" + profile.id;

            const naverUser = {
                uid,
                email: profile.email || "",
                name: profile.name || "네이버사용자",
                nickname: profile.nickname || profile.name || "네이버사용자",
                photoURL: profile.profile_image || "",
                provider: "naver",
            };

            const userRef = doc(db, "people", uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, naverUser);
                console.log("신규 네이버 회원 Firestore 등록 완료");
            } else {
                console.log("기존 네이버 회원 Firestore 데이터 있음");
            }

            set({ user: naverUser });

            alert(`${naverUser.nickname}님, 네이버 로그인 성공!`);
            return naverUser;

        } catch (err) {
            console.error("네이버 로그인 오류:", err);
            alert("네이버 로그인 실패: " + err.message);
            throw err;
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
