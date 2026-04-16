import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Member from "./pages/Member";
import Footer from "./components/Footer";
import Project from "./pages/Project";
import Collections from "./pages/Collections";
import About from "./pages/About";
import { useProductStore } from "./store/useProductStore";
import { useEffect } from "react";
import UserInfo from "./pages/UserInfo";
import ProductList from "./pages/ProductList";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { items, onFetchItem, onMenus } = useProductStore();

  useEffect(() => {
    onFetchItem();
    onMenus();
  }, [onFetchItem, onMenus]);

  if (!items.length) return <div>로딩중...</div>;
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/:category1/:category2" element={<ProductList />} />

        <Route path="/project" element={<Project />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/userInfo" element={<UserInfo />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
