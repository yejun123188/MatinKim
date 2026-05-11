import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Member from "./pages/Member";
import Footer from "./components/Footer";
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
import FindId from "./pages/FindId";
import InquiryDetail from "./components/InquiryDetail";
import FindPw from "./pages/FindPw";
import FindIdResult from "./pages/FindIdResult";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function App() {
  const { items, onFetchItem, onMenus } = useProductStore();
  const { onFetchStore, stores } = useMapStore();
  const { initAuth } = useAuthStore();

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
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category1" element={<ProductList />} />
        <Route path="/:category1/:category2" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
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
        <Route
          path="/userInfo/orders/:id/:action/:itemId"
          element={<UserInfo />}
        />
        <Route path="/userInfo/orders/:id" element={<UserInfo />} />
        <Route path="/userInfo/address" element={<AddressRegister />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/qna" element={<Qna />} />
        <Route
          path="/product-authentication"
          element={<ProductAuthentication />}
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/agreement" element={<Agreement />} />

        <Route
          path="productauthentication"
          element={<ProductAuthentication />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-complete" element={<OrderComplete />} />
        <Route path="/order-lookup" element={<OrderLookup />} />
        <Route path="/board" element={<QnaWrite />} />
        <Route path="/inquiry/write" element={<InquiryList />} />
        <Route path="/find" element={<FindId />} />
        <Route path="/inquiry/:id" element={<InquiryDetail />} />
        <Route path="/password/find" element={<FindPw />} />
        <Route path="/findid/result" element={<FindIdResult />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
