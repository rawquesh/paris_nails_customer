import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../../utils/auth";
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
    <div className={styles.main}>
      <Button variant="contained" onClick={signout}>
        Logout
      </Button>
    </div>
  );
}
