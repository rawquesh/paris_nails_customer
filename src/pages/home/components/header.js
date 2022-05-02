import { Button, Link, Typography } from "@mui/material";
import React from "react";
import { logOut } from "../../../utils/auth";
import { useUserAuth } from "../../../utils/context/auth_context";

import "./css/header.css";

export default function Header() {
  //   const componentRef = useRef();

  // logOut()

  return (
    <>
      {/* <div className="top-header"></div> */}
      <NavBar />
      <MainLabel click={() => {}} />
    </>
  );
}

function MainLabel() {
  return (
    <div className="mainlabel">
      <Typography
        style={{
          marginBottom: "20px",
          // textTransform: "uppercase",
          fontSize: "17px",
          letterSpacing: ".5px",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Book our services at best prices.
      </Typography>
      <Link href="/services" underline="none">
        <Button
          sx={{
            fontSize: "14px",
            color: "black",
            padding: "8px 30px",
            borderRadius: "100px",
            fontFamily: "Montserrat, sans-serif",
          }}
          variant="outlined"
        >
          Book Now
        </Button>
      </Link>
    </div>
  );
}

function MyButton2({ title, className, path }) {
  return (
    <Link href={path} underline="none">
      <Button
        style={{
          margin: "10px 2px",
          padding: "8px",
          borderRadius: "3px",
        }}
      >
        <Typography
          fontFamily="Montserrat, sans-serif"
          className="header_text"
          color="black"
        >
          {title}
        </Typography>
      </Button>
    </Link>
  );
}
function MyButton({ title, path }) {
  return (
    <Link href={path} underline="none">
      <Button
        variant="outlined"
        style={{
          margin: "10px 0px",
          padding: "6px 25px",
          borderRadius: "100px",
        }}
      >
        <Typography
          fontFamily="Montserrat, sans-serif"
          className="header_text"
          color="black"
        >
          {title}
        </Typography>
      </Button>
    </Link>
  );
}

export function NavBar() {
  const { user } = useUserAuth();

  return (
    <div className="main-header">
      <Link href="/">
        <img
          alt="Logo"
          className="header-item header-item-1"
          src="images/logo.png"
        />
      </Link>
      <div className="header-item header-item-2">
        <MyButton2 title="Services" path="/services" />
        <MyButton2 title="Contact Us" path="#contact" />
        {user ? (
          <MyButton title="Account" path="/account" />
        ) : (
          <MyButton title="Sign In" path="/login" />
        )}
      </div>
    </div>
  );
}
