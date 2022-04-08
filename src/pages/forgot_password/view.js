import React from "react";

import {
  Box,
  Button,
  Link,
  TextField,
} from "@mui/material";

import styles from "./style.module.css";

export default function ForgotPassword() {
  function handleSubmit(event) {



  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="div">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Reset Password</h2>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          onChange={handleSubmit}
          autoComplete="email"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, p: 1.4 }}
        >
          Send Link
        </Button>
        <div className={styles.links}>
          <Link href="/login" variant="body2">
            {"Click Here To Login Now."}
          </Link>
        </div>
    </div>
  );
}
