import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { create } from "zustand";
import { auth, db, googleProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";




export const useAuthStore = create((set, get) => ({
    user: null,


    initAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                set({ user: null });
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
                };

                await setDoc(userRef, userInfo);
                set({ user: userInfo });
            }
        });
    },

    onMember: async ({ uName, nickname, email, password, phone, profile }) => {
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            const user = userCredential.user;


            await sendEmailVerification(user);


            const userRef = doc(db, "users", user.uid)


            const userInfo = {
                uid: user.uid,
                name: uName,
                nickname,
                email,
                phone,
                profile
            }

            await setDoc(userRef, userInfo);

            alert("회원가입 성공! 이메일 인증을 완료해주세요")
        }
        catch (err) {
            alert(err.message)
        }
    }, onMember: async ({
        userId,
        uName,
        nickname,
        email,
        password,
        phone,
        profile,
        gender,
        birth,
        agreements
    }) => {
        try {
            // 아이디 중복 체크
            const userIdRef = doc(db, "userIds", userId);
            const userIdSnap = await getDoc(userIdRef);

            if (userIdSnap.exists()) {
                throw new Error("이미 사용 중인 아이디입니다.");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

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

            // 아이디로 이메일 찾기 위한 매핑 저장
            await setDoc(userIdRef, {
                uid: user.uid,
                email,
            });

            alert("회원가입 성공! 이메일 인증을 완료해주세요.");
        } catch (err) {
            console.error("회원가입 에러:", err);
            throw err;
        }
    },

    onLogin: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

}))