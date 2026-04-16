import { Route, Routes } from "react-router-dom";
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
import CollectionDetail from "./pages/CollectionDetail";
import ProjectDetail from "./pages/ProjectDetail";


function App() {
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

        <Route path="/project" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/userInfo" element={<UserInfo />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
