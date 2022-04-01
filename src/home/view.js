import { Grid, Typography } from "@mui/material";
import React from "react";
import "./style.css";
import "./section2.css";
import Header from "./components/header";

export default function Home() {
  return (
    <div>
      <div className="big-image">
        <Header />
      </div>
      <div className="header-1">
        <img className="header-1-item" src="images/home-1.png" />
        <div className="header-1-item">
          <div className="">
            <h2 class="heading-decorate">
              Why Our Clients <br />
              <span class="divider"></span>Choose Us
            </h2>
          </div>
          <p>
            Our salon aims to deliver the best nail design experience and
            top-notch customer service.
          </p>
          <p>
            We use all-natural, organic body products, hard-to-find polish
            brands and colors, iPads at every seat, and a drink menu featuring
            fresh-pressed juices and hand-crafted coffees.
          </p>
          <br />
          <br />
        </div>
      </div>

      {/* section2 */}
      <div className="main">
        <div className="main-item main-item-1">
          {ServicesItems.map((e) => (
            <div className="service-item">
              <div style={{maxWidth : "300px"}} >
                <div className="svg">
                  <img src={e.icon} />
                </div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="main-item main-item-2"></div>
      </div>
    </div>
  );
}

const ServicesItems = [
  {
    icon: "images/home-svg-1.svg",
    title: "Manicure",
    desc: "Our manicure treatments stimulate nail growth and soften dry, dull skin.",
  },
  {
    icon: "images/home-svg-2.svg",
    title: "Pedicure",
    desc: "Pedicure services provide full restoration for your nails with extra polishing.",
  },
  {
    icon: "images/home-svg-3.svg",
    title: "Nail Art",
    desc: "Let our nail artists create a stunning and sustainable nail design for you.",
  },
  {
    icon: "images/home-svg-4.svg",
    title: "Paraffin Wax",
    desc: "This is a treatment for hands and feet that complements your manicure and pedicure.",
  },
];
