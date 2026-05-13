import React from "react";
import Instagram from "../components/Instagram";
import Flagship from "../components/Flagship";
import TheEdit from "../components/TheEdit";
import Weeklybest from "../components/Weeklybest";
import NewArrivals from "../components/NewArrivals";
import MainTop from "../components/MainTop";
import Collection from "../components/Collection";
import ShortCut from "../components/ShortCut";
import TimeSalePopup from "../components/TimeSalePopup";
import { BRAND, useBrandStore } from "../store/useBrandStore";
import "./scss/KimMatin.scss";

export default function Home() {
  const { brand } = useBrandStore();
  const isKimMatin = brand === BRAND.KIMMATIN;

  return (
    <>
      {!isKimMatin && <TimeSalePopup />}

      <main className={isKimMatin ? "kimmatin-home" : ""}>
        <MainTop />
        {!isKimMatin && <ShortCut />}
        <Weeklybest />
        {!isKimMatin && <NewArrivals />}
        {!isKimMatin && <TheEdit />}
        {!isKimMatin && <Flagship />}
        <Collection />
        <Instagram />
      </main>
    </>
  );
}
