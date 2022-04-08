import React from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
} from "@mui/material";

import styles from "./style.module.css";
import GoogleButton from "react-google-button";

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      remember: data.get("remember"),
    });
  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="body2">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Login</h2>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
        <FormControlLabel
          control={<Checkbox name="remember" value="remember" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2, p: 1.4 }}
        >
          Login
        </Button>
        <GoogleButton
          style={{ width: "100%", marginBottom: "10px" }}
          onClick={() => {
            console.log("google hihi");
          }}
        />

        <div className={styles.links}>
          <Link href="/forgot-password" variant="body2">
            Forgot password?
          </Link>
          <Link href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </div>
      </Box>
    </div>
  );
}
