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
import Brand from "./pages/Brand";
import Stockist from "./pages/Stockist";
import GuestOrder from "./pages/GuestOrder";
import Qna from "./pages/Qna";
import { useMapStore } from "./store/useMapStore";
import AddressRegister from "./components/AddressRegister";


function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { items, onFetchItem, onMenus } = useProductStore();
  const { onFetchStore, stores, } = useMapStore();

  useEffect(() => {
    onFetchItem();
    onMenus();
    onFetchStore();
  }, [onFetchItem, onMenus, stores]);

  if (!items.length) return <div>로딩중...</div>;
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category1/:category2" element={<ProductList />} />
        <Route path="/guest-order" element={<GuestOrder />} />
        <Route path="/project" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/about" element={<About />} >
          <Route index element={<Brand />} />
          <Route path="brand" element={<Brand />} />
          <Route path="stockist" element={<Stockist />} />
        </Route>
        <Route path="/userInfo" element={<UserInfo />} />
        <Route path="address/new" element={<AddressRegister />} />
        <Route path="/qna" element={<Qna />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
