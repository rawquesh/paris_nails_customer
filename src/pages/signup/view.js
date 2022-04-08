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

export default function SignUp() {
  function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    console.log({
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      password: data.get("password"),
      remember: data.get("remember"),
    });
  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="div">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Sign Up</h2>
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
