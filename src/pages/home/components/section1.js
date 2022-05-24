import React from "react";
import { SHOP_DESC2 } from "../../../utils/const";
import "./css/section1.css";

export default function Section1() {
  return (
    <div className="header-1">
      <img alt="showcase" className="header-1-item" src="images/home-1.png" />
      <div className="header-1-item">
        <div className="">
          <h2 className="heading-decorate">
            Why Our Clients <br />
            <span className="divider"></span>Choose Us
          </h2>
        </div>
        <p>
          Our salon aims to deliver the best nail design experience and
          top-notch customer service.
        </p>
        <p>
        {SHOP_DESC2}
        </p>
        <br />
        <br />
      </div>
    </div>
  );
}
