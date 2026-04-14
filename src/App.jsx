import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Member from './pages/Member'
import Footer from './components/Footer'
import Project from './pages/Project'
import Collections from './pages/Collections'
import About from './pages/About'
import { useProductStore } from './store/useProductStore'
import { useEffect } from 'react'

function App() {

  const { items, onFetchItem, onMenus } = useProductStore();

  useEffect(() => {
    onFetchItem();
    onMenus();
  }, [onFetchItem, onMenus])

  if (!items.length) return <div>로딩중...</div>
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/project' element={<Project />} />
        <Route path='collections' element={<Collections />} />
        <Route path='about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/member' element={<Member />} />


      </Routes>
      <Footer />
    </>
  )
}

export default App
