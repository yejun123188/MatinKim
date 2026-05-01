import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db, googleProvider } from "../firebase/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

const formatCouponDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCouponPeriod = () => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 60);
  return `${formatCouponDate(startDate)} ~ ${formatCouponDate(endDate)}`;
};

const usableCoupons = {
  "000627": { couponName: "예준전용 쿠폰" },
  "021109": { couponName: "하영전용쿠폰" },
  "980803": { couponName: "호정전용쿠폰" },
  "950325": { couponName: "재희전용쿠폰" },
};

const defaultSavedMoneyList = [
  {
    id: "welcome-point",
    date: "2026-04-08",
    point: 5000,
    order: "-",
    desc: "신규회원 적립금",
    type: "history",
  },
  {
    id: "shipping-pending-point",
    date: "2026-04-09",
    point: 2000,
    order: "-",
    desc: "배송 대기 적립금",
    type: "pending",
  },
  {
    id: "member-grade-point",
    date: "2026-04-10",
    point: 1000,
    order: "-",
    desc: "회원등급 적립금",
    type: "grade",
  },
  {
    id: "used-point",
    date: "2026-04-11",
    point: 2000,
    order: "-",
    desc: "상품 구매 사용 적립금",
    type: "used",
  },
  {
    id: "refund-point",
    date: "2026-04-12",
    point: 3000,
    order: "-",
    desc: "환불예정 적립금",
    type: "refund",
  },
];

const getSavedMoneySummary = (list) => {
  const sumByType = (type) =>
    list
      .filter((item) => item.type === type)
      .reduce((sum, item) => sum + Number(item.point || 0), 0);

  const earnedPoint = sumByType("history");
  const gradePoint = sumByType("grade");
  const usedPoint = sumByType("used");
  const unavailablePoint = sumByType("pending");
  const refundPoint = sumByType("refund");

  const totalPoint =
    earnedPoint + gradePoint + unavailablePoint + refundPoint - usedPoint;

  const availablePoint = Math.max(earnedPoint + gradePoint - usedPoint, 0);

  return {
    totalPoint,
    availablePoint,
    usedPoint,
    unavailablePoint,
    refundPoint,
  };
};

export const getMemberGrade = (purchaseAmount = 0) => {
  const amount = Number(purchaseAmount || 0);
  if (amount >= 500000) return "VIP";
  if (amount >= 200000) return "GOLD";
  return "FRIENDS";
};

const getLocalPurchaseKey = (user) =>
  `matinKimPurchase:${user?.uid || user?.email || "guest"}`;

export const getLocalPurchaseInfo = (user) => {
  try {
    return JSON.parse(localStorage.getItem(getLocalPurchaseKey(user)) || "{}");
  } catch {
    return {};
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userAddress: null,
      addressList: [],
      couponList: [],
      savedMoneyList: [],
      savedMoneySummary: getSavedMoneySummary([]),

      initAuth: () => {
        const savedSocialUser = localStorage.getItem("socialUser");

        if (savedSocialUser) {
          set({ user: JSON.parse(savedSocialUser) });
        }

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (!firebaseUser) {
            if (!savedSocialUser) {
              set({ user: null });
            }
            return;
          }

          const providerId = firebaseUser.providerData?.[0]?.providerId;
          const isEmailPasswordUser = providerId === "password";

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
              purchaseAmount: 0,
              purchaseCount: 0,
              grade: "FRIENDS",
            };

            await setDoc(userRef, userInfo);
            set({ user: userInfo });
          }
        });
      },

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
          const userIdRef = doc(db, "userIds", userId);
          const userIdSnap = await getDoc(userIdRef);

          if (userIdSnap.exists()) {
            throw new Error("이미 사용 중인 아이디입니다.");
          }

          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userCredential.user;

          await sendEmailVerification(user);

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
            purchaseAmount: 0,
            purchaseCount: 0,
            grade: "FRIENDS",
          };

          await setDoc(doc(db, "users", user.uid), userInfo);

          await setDoc(doc(db, "users", user.uid, "coupons", "WELCOME5"), {
            couponName: "WELCOME 5% 쿠폰",
            benefit: "5% 할인",
            period: getCouponPeriod(),
            applyProduct: "전체상품",
            minPrice: "제한없음",
            payment: "제한없음",
            code: "WELCOME5",
            used: false,
          });

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
          }

          set({ user: firebaseUser });
          return firebaseUser;
        } catch (err) {
          console.error("아이디 로그인 에러:", err);
          throw err;
        }
      },

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
            purchaseAmount: 0,
            purchaseCount: 0,
            grade: "FRIENDS",
          };

          const userRef = doc(db, "people", googleUser.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, googleUser);
          }

          set({ user: googleUser });
          localStorage.setItem("socialUser", JSON.stringify(googleUser));

          alert(`${googleUser.nickname}님, 구글 로그인되었습니다!`);
          return googleUser;
        } catch (err) {
          console.error("구글 로그인 오류:", err);
          alert("구글 로그인 실패: " + err.message);
          throw err;
        }
      },

      onKakaoLogin: async () => {
        try {
          if (!window.Kakao) {
            throw new Error("카카오 SDK가 로드되지 않았습니다.");
          }

          if (!window.Kakao.isInitialized()) {
            window.Kakao.init("415096494840a6ca548a1d48257b2766");
          }

          await new Promise((resolve, reject) => {
            window.Kakao.Auth.loginForm({
              scope: "profile_nickname,profile_image",
              success: resolve,
              fail: reject,
            });
          });

          const res = await window.Kakao.API.request({
            url: "/v2/user/me",
          });

          const uid = res.id.toString();

          const kakaoUser = {
            uid,
            email: res.kakao_account?.email || "",
            name: res.kakao_account.profile?.nickname || "카카오사용자",
            nickname: res.kakao_account.profile?.nickname || "카카오사용자",
            photoURL: res.kakao_account.profile?.profile_image_url || "",
            provider: "kakao",
            purchaseAmount: 0,
            purchaseCount: 0,
            grade: "FRIENDS",
          };

          const userRef = doc(db, "people", uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, kakaoUser);
          }

          set({ user: kakaoUser });
          localStorage.setItem("socialUser", JSON.stringify(kakaoUser));

          alert(`${kakaoUser.nickname}님, 카카오 로그인되었습니다!`);
          return kakaoUser;
        } catch (err) {
          console.error("카카오 로그인 중 오류:", err);
          alert("카카오 로그인 실패: " + err.message);
        }
      },

      onNaverLogin: async () => {
        try {
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
            purchaseAmount: 0,
            purchaseCount: 0,
            grade: "FRIENDS",
          };

          const userRef = doc(db, "people", uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, naverUser);
          }

          set({ user: naverUser });
          localStorage.setItem("socialUser", JSON.stringify(naverUser));

          alert(`${naverUser.nickname}님, 네이버 로그인되었습니다.`);
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
          localStorage.removeItem("socialUser");
          localStorage.removeItem("auth-storage");

          set({
            user: null,
            savedMoneyList: [],
            savedMoneySummary: getSavedMoneySummary([]),
          });
        } catch (err) {
          console.error("로그아웃 에러:", err);
        }
      },

      onUpdateUserInfo: async (userInfo) => {
        const { user } = get();

        if (!user) {
          alert("로그인이 필요합니다");
          return;
        }

        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, userInfo, { merge: true });

          set({
            user: {
              ...user,
              ...userInfo,
            },
          });

          alert("회원정보가 수정되었습니다.");
        } catch (err) {
          console.error("회원정보 수정 에러:", err);
          alert("회원정보 수정에 실패했습니다.");
        }
      },

      onRecordPurchase: async (purchaseAmount, purchaseCount = 1) => {
        const { user } = get();

        if (!user) {
          alert("로그인이 필요합니다.");
          return false;
        }

        const savedPurchaseInfo = getLocalPurchaseInfo(user);
        const currentAmount = Number(
          savedPurchaseInfo.purchaseAmount ??
            user.purchaseAmount ??
            user.orderPrice ??
            0
        );
        const currentCount = Number(
          savedPurchaseInfo.purchaseCount ??
            user.purchaseCount ??
            user.orderCount ??
            0
        );

        const nextAmount = currentAmount + Number(purchaseAmount || 0);
        const nextCount = currentCount + Number(purchaseCount || 0);
        const grade = getMemberGrade(nextAmount);

        const purchaseInfo = {
          purchaseAmount: nextAmount,
          purchaseCount: nextCount,
          orderPrice: nextAmount,
          orderCount: nextCount,
          grade,
        };

        const nextUser = {
          ...user,
          ...purchaseInfo,
        };

        localStorage.setItem(
          getLocalPurchaseKey(user),
          JSON.stringify(purchaseInfo)
        );

        set({ user: nextUser });

        if (user.provider) {
          localStorage.setItem("socialUser", JSON.stringify(nextUser));
        }

        return true;
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

      openPostcode: (callback) => {
        new window.daum.Postcode({
          oncomplete: function (data) {
            const address = data.roadAddress || data.jibunAddress;

            callback({
              zipcode: data.zonecode,
              address,
            });
          },
        }).open({
          popupName: "postcodePopup",
        });
      },

      onFetchAddress: async () => {
        const { user } = get();
        if (!user) return;

        const ref = collection(db, "users", user.uid, "addresses");
        const snap = await getDocs(ref);

        const result = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        result.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

        set({
          addressList: result,
          userAddress: result.find((v) => v.isDefault) || result[0] || null,
        });
      },

      onSetDefaultAddress: async (selectedId) => {
        const { user } = get();
        if (!user) return;

        const ref = collection(db, "users", user.uid, "addresses");
        const snap = await getDocs(ref);

        const currentDefault = snap.docs.find((d) => d.data().isDefault);

        if (currentDefault) {
          await updateDoc(
            doc(db, "users", user.uid, "addresses", currentDefault.id),
            { isDefault: false }
          );
        }

        await updateDoc(doc(db, "users", user.uid, "addresses", selectedId), {
          isDefault: true,
        });

        get().onFetchAddress();
      },

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

      onFetchCoupons: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const ref = collection(db, "users", user.uid, "coupons");
          const snap = await getDocs(ref);

          const coupons = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          set({ couponList: coupons });
        } catch (err) {
          console.error("쿠폰 불러오기 에러:", err);
          alert("쿠폰을 불러오지 못했습니다.");
        }
      },

      onAddCoupon: async (couponCode) => {
        const { user } = get();
        const code = couponCode.trim().replaceAll("-", "").toUpperCase();

        if (!user) {
          alert("로그인이 필요합니다");
          return false;
        }

        if (!code) {
          alert("쿠폰번호를 입력해주세요.");
          return false;
        }

        const couponInfo = usableCoupons[code];

        if (!couponInfo) {
          alert("사용할 수 없는 쿠폰번호입니다.");
          return false;
        }

        try {
          const couponRef = doc(db, "users", user.uid, "coupons", code);
          const couponSnap = await getDoc(couponRef);

          if (couponSnap.exists()) {
            alert("이미 등록된 쿠폰입니다.");
            return false;
          }

          const couponData = {
            couponName: couponInfo.couponName,
            benefit: "100% 할인",
            period: getCouponPeriod(),
            applyProduct: "전체상품",
            minPrice: "제한없음",
            payment: "제한없음",
            code,
            used: false,
          };

          await setDoc(couponRef, couponData);
          await get().onFetchCoupons();

          alert("쿠폰이 등록되었습니다.");
          return true;
        } catch (err) {
          console.error("쿠폰 등록 에러:", err);
          alert("쿠폰 등록에 실패했습니다.");
          return false;
        }
      },

      onFetchSavedMoney: async () => {
        const { user } = get();

        if (!user) {
          set({
            savedMoneyList: [],
            savedMoneySummary: getSavedMoneySummary([]),
          });
          return;
        }

        try {
          const ref = collection(db, "users", user.uid, "savedMoney");
          const snap = await getDocs(ref);
          const savedIds = new Set(snap.docs.map((doc) => doc.id));

          const missingDefaultList = defaultSavedMoneyList.filter(
            (item) => !savedIds.has(item.id)
          );

          if (missingDefaultList.length > 0) {
            await Promise.all(
              missingDefaultList.map(({ id, ...item }) =>
                setDoc(doc(db, "users", user.uid, "savedMoney", id), item)
              )
            );
          }

          const nextSnap =
            missingDefaultList.length > 0 ? await getDocs(ref) : snap;

          const savedMoneyList = nextSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => String(b.date).localeCompare(String(a.date)));

          const savedMoneySummary = getSavedMoneySummary(savedMoneyList);

          await setDoc(
            doc(db, "users", user.uid),
            { savedMoneySummary },
            { merge: true }
          );

          set({ savedMoneyList, savedMoneySummary });
        } catch (err) {
          console.error("적립금 불러오기 에러:", err);
          alert("적립금을 불러오지 못했습니다.");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);