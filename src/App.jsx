import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Member from "./pages/Member";
import Footer from "./components/Footer";
import Floating from "./components/Floating";
import Project from "./pages/Project";
import Collections from "./pages/Collections";
import About from "./pages/About";
import { useProductStore } from "./store/useProductStore";
import { useEffect } from "react";
import UserInfo from "./pages/UserInfo";
import CollectionDetail from "./pages/CollectionDetail";
import ProjectDetail from "./pages/ProjectDetail";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Brand from "./pages/Brand";
import Stockist from "./pages/Stockist";
import GuestOrder from "./pages/GuestOrder";
import Qna from "./pages/Qna";
import { useMapStore } from "./store/useMapStore";
import AddressRegister from "./components/AddressRegister";
import ProductAuthentication from "./pages/ProductAuthentication";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import { useAuthStore } from "./store/useAuthStore";
import Guide from "./pages/Guide";
import Privacy from "./pages/Privacy";
import Agreement from "./pages/Agreement";
import Cart from "./pages/Cart";
import OrderComplete from "./pages/OrderComplete";
import OrderLookup from "./pages/OrderLookup";
import QnaWrite from "./pages/QnaWrite";
import InquiryList from "./components/InquiryList";
import Search from "./pages/Search";
import FindId from "./pages/FindId";
import InquiryDetail from "./components/InquiryDetail";
import FindPw from "./pages/FindPw";
import FindIdResult from "./pages/FindIdResult";
import KimMatinArchive from "./pages/KimMatinArchive";
import KimMatinAbout from "./pages/KimMatinAbout";
import KimMatinFaq from "./pages/KimMatinFaq";
import KimMatinQna from "./pages/KimMatinQna";
import KimMatinGuide from "./pages/KimMatinGuide";
import KimMatinPrivacy from "./pages/KimMatinPrivacy";
import KimMatinTerms from "./pages/KimMatinTerms";
import { useLoginStore } from "./store/useLoginStore";
import Login from "./pages/Login";
import { BRAND, useBrandStore } from "./store/useBrandStore";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const { items, onFetchItem, onMenus } = useProductStore();
  const { onFetchStore, stores } = useMapStore();
  const { initAuth } = useAuthStore();
  const { isLoginOpen, guestMode, guestOrderItems, closeLogin } = useLoginStore();
  const { brand } = useBrandStore();
  const isKimMatin = brand === BRAND.KIMMATIN;

  useEffect(() => {
    initAuth();
    onFetchItem();
    onMenus();
    onFetchStore();
  }, [onFetchItem, onMenus, stores]);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  if (!items.length) return <div>로딩중...</div>;

  return (
    <div className={`app-shell ${isKimMatin ? "app-shell--kimmatin" : "app-shell--matinkim"}`}>
      <Header />
      <ScrollToTop />
      <div className="app-content" key={pathname}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/:category1" element={<ProductList />} />
        <Route path="/:category1/:category2" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/kimmatin/archive" element={<KimMatinArchive />} />
        <Route path="/kimmatin/about" element={<KimMatinAbout />}>
          <Route index element={<></>} />
          <Route path="brand" element={<></>} />
          <Route path="stockist" element={<></>} />
          <Route path="contact" element={<></>} />
        </Route>
        <Route path="/kimmatin/faq" element={<KimMatinFaq />} />
        <Route path="/kimmatin/qna" element={<KimMatinQna />} />
        <Route path="/kimmatin/guide" element={<KimMatinGuide />} />
        <Route path="/kimmatin/privacy-policy" element={<KimMatinPrivacy />} />
        <Route path="/kimmatin/terms" element={<KimMatinTerms />} />
        <Route path="/guest-order" element={<GuestOrder />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/project" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/about" element={<About />}>
          <Route index element={<Brand />} />
          <Route path="brand" element={<Brand />} />
          <Route path="stockist" element={<Stockist />} />
        </Route>
        <Route path="/userInfo" element={<UserInfo />} />
        <Route path="/userInfo/orders/:id/:action/:itemId" element={<UserInfo />} />
        <Route path="/userInfo/orders/:id" element={<UserInfo />} />
        <Route path="/userInfo/address" element={<AddressRegister />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/qna" element={<Qna />} />
        <Route path="/product-authentication" element={<ProductAuthentication />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="productauthentication" element={<ProductAuthentication />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-complete" element={<OrderComplete />} />
        <Route path="/order-lookup" element={<OrderLookup />} />
        <Route path="/board" element={<QnaWrite />} />
        <Route path="/inquiry/write" element={<InquiryList />} />
        <Route path="/find" element={<FindId />} />
        <Route path="/inquiry/:id" element={<InquiryDetail />} />
        <Route path="/password/find" element={<FindPw />} />
        <Route path="/findid/result" element={<FindIdResult />} />
        <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {/* Routes 밖으로 꺼내야 어느 페이지에서든 렌더링됨 */}
      {isLoginOpen && (
        <Login
          onClose={closeLogin}
          guestMode={guestMode}
          guestOrderItems={guestOrderItems}
        />
      )}

      <Footer />
      <Floating />
    </div>
  );
}

export default App;
