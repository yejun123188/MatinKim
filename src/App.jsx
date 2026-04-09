import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Route>
        <Route path="/" element={<Home />} />
      </Route>
      <Footer />
    </>
  );
}

export default App;
