import React from "react";
import "./style.css";
import Header from "./components/header";
import Section2 from "./components/section2";
import Members from "./components/members";
import Section1 from "./components/section1";
import Prices from "./components/prices";
import Contact from "./components/contact";
import Footer, { Bottom } from "./components/footer";

export default function Home() {
  return (
    <>
      <div className="big-image">
        <Header />
      </div>
      <Section1 />
      <Section2 />
      <Members />
      <Prices />
      <Contact />
      <Footer />
      <Bottom />
    </>
  );
}
