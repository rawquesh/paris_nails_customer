import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { bgcolor } from "@mui/system";
import React, { useRef, useResize } from "react";
// import {  } from "react-router";

import "./header.css";

export default function Header() {
  //   const componentRef = useRef();

  //   const history = useHistory();

  function onClick() {
    // history.push("/dashboard");
  }

  return (
    <>
      <div className="top-header"></div>
        <div className="main-header">
          <img
            alt="Logo"
            className="header-item header-item-1"
            src="images/logo.png"
          />
          <div className="header-item header-item-2">
            <MyButton2 title="Services" onClick={onClick} />
            {/* <MyButton2 className="toggle" title="About Us" onClick={onClick} /> */}
            <MyButton2 title="Contact Us" onClick={onClick} />
            <MyButton title="Login" onClick={onClick} />
          </div>
      </div>
      <MainLabel click={() => {}} />
    </>
  );
}

function MainLabel({ click }) {
  return (
    <div className="mainlabel">
      <Typography
        style={{
          marginBottom: "20px",
          textTransform: "uppercase",
          fontSize: "13px",
          letterSpacing: "1px",
        }}
      >
        Book our services at best prices.
      </Typography>
      <Button sx={{ fontSize: "14px",color : "#d92a7c",padding  : "8px 30px",borderRadius : "100px"  }} variant="contained" onClick={click}>
        Book Now
      </Button>
    </div>
  );
}

function MyButton2({ title, onClick, className }) {
  return (
    <Button
      onClick={onClick}
      className={className + " top_buttons"}
      style={{
        margin: "5px 5px 0",
        // padding : "0px",
        borderRadius: "3px",
      }}
    >
      <Typography className="header_text" color="black">
        {title}
      </Typography>
    </Button>
  );
}
function MyButton({ title, onClick }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      style={{
        margin: "5px 5px 0",
        padding: "5px 25px",
        borderRadius: "100px",
      }}
    >
      <Typography className="header_text" color="black">
        {title}
      </Typography>
    </Button>
  );
}
