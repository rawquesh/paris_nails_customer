import React, { useState } from "react";

import { Box, Button, Link, TextField } from "@mui/material";

import styles from "./style.module.css";
import { logIn, signUp, updateName } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { MyAlert } from "../../components/alerts";
import { useUserAuth } from "../../utils/context";

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  if (user) {
    navigate("/");
  }

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const val = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      password: data.get("password"),
    };

    console.log(val);

    if (
      val.first_name === "" ||
      val.last_name === "" ||
      val.email === "" ||
      val.password === ""
    ) {
      setError("Please fill the fields.");
      return;
    }

    try {
      await signUp(val.email, val.password);
      const user = await logIn(val.email, val.password);
      await updateName(user.user, val.first_name, val.last_name);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="div">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Sign Up</h2>
      {error && (
        <MyAlert
          type="error"
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <div className={styles.name}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoComplete="given-name"
            autoFocus
          />
          <span className={styles.break} />
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            autoComplete="family-name"
          />
        </div>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, p: 1.4 }}
        >
          Sign In
        </Button>
        <div className={styles.links}>
          <Link href="/login" variant="body2">
            {"Already have an account? Login."}
          </Link>
        </div>
      </Box>
    </div>
  );
}
