import React, { useState } from "react";

import { Button, Link, TextField } from "@mui/material";

import styles from "./style.module.css";
import { MyAlert } from "../../components/feedback";
import { passwordReset } from "../../utils/auth";

import isEmail from "validator/es/lib/isEmail";

export default function ForgotPassword() {
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [isSuccess, setSuccess] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  async function handleSubmit() {
    if (!isEmail(email)) {
      setError('Enter a vaild email address.');
      return;
    }

    try {
      await passwordReset(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="div">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Reset Password</h2>
      {isSuccess && (
        <MyAlert
          type="success"
          message={"Password reset link sent."}
          onClose={() => {
            setSuccess(false);
          }}
        />
      )}
      {error && (
        <MyAlert
          type="error"
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        onChange={handleChange}
        autoComplete="email"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleSubmit}
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
