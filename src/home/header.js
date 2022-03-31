import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { bgcolor } from "@mui/system";
import React, { useRef, useResize } from "react";
// import {  } from "react-router";
import "./style.css";

export default function Header() {
  //   const componentRef = useRef();

  //   const history = useHistory();

  function onClick() {
    // history.push("/dashboard");
  }

  return (
    <>
      <div
        style={{ width: "100%", height: "45px", backgroundColor: "#d92a7c" }}
      ></div>

      <Toolbar
        style={{ backgroundColor: "white", margin: "0px", padding: "15px" }}
        variant="regular"
      >
        <img alt="Logo" className="logo" src="images/logo.png" />
        <Box sx={{ flexGrow: 1 }} />
        <MyButton2 title="Services" onClick={onClick} />
        <MyButton2 className="toggle" title="About Us" onClick={onClick} />
        <MyButton2 title="Contact Us" onClick={onClick} />
        <MyButton title="Login" onClick={onClick} />
      </Toolbar>
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
      <Button sx={{ fontSize: "14px" }} variant="contained" onClick={click}>
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
