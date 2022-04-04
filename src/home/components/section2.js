import React from "react";
import "./section2.css";

export default function Section2() {
  return (
    <div className="main">
      <div className="main-item main-item-1">
        {ServicesItems.map((e) => (
          <div key={e.title} className="service-item">
            <div style={{ maxWidth: "300px" }}>
              <div className="svg">
                <img alt="icon" src={e.icon} />
              </div>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="main-item main-item-2"></div>
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
