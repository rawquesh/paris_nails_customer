import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { logOut } from "../../utils/auth";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import styles from "./style.module.css";

export default function Account() {
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    console.log(location.state?.user);
  }, []);

  async function signout() {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <>
      <NavBar />
      <Heading title="Account" />
      <div className={styles.main}>
        <Button variant="contained" fullWidth onClick={signout}>
          Logout
        </Button>
      </div>
      <Footer />
      <Bottom />
    </>
  );
}
