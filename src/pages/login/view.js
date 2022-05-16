import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  // Checkbox,
  // FormControlLabel,
  Link,
  TextField,
} from "@mui/material";

import isEmail from "validator/es/lib/isEmail";
import GoogleButton from "react-google-button";

import styles from "./style.module.css";
import { googleSignIn, logIn } from "../../utils/auth";
import { MyAlert } from "../../components/feedback";
import { useUserAuth } from "../../utils/context/auth_context";
import withQuery from "../../utils/functions/with_query";

export default function Login() {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);

  async function handleSubmit(event) {
    setLogging(true);
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const values = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (values.email === "" || values.password === "") {
      setError("Please fill the fields.");
      return;
    }

    if (!isEmail(values.email)) {
      setError("Enter a vaild email address.");
      return;
    }

    try {
      const cred = await logIn(values.email, values.password);
      navigate("/account", { state: { user: cred.user } });
    } catch (error) {
      console.log(error.message);
      setError(`${error.message}`);
    }
  }

  const handleGoogleSignIn = async (e) => {
    setLogging(true);
    e.preventDefault();
    try {
      const cred = await googleSignIn();
      const user = cred.user;
      console.log(user.toJSON());
      const token = await user.getIdToken();
      const res = await fetch(
        `https://australia-southeast1-possystem-db408.cloudfunctions.net/user?token=${token}`
      );
      if (res.status === 204) {
        setError("first time huh?, updating...");
        let _phone;
        if (user?.phoneNumber) {
          _phone = "0" + user.phoneNumber.replace(/\D/g, "").slice(-9);
        }
        await fetch(
          "https://australia-southeast1-possystem-db408.cloudfunctions.net/user",
          {
            method: "POST",
            headers: {
              headers: { "Content-type": "text/plain" },
            },
            body: JSON.stringify({
              token: token,
              name: user?.displayName.trim() ?? "",
              gender: "",
              email: user?.email ?? "",
              phone: user?.phoneNumber ? _phone : "",
            }),
          }
        );
      }
      navigate("/account", { state: { user: user.toJSON() } });
    } catch (error) {
      if ("message" in error) {
        console.log(error.message);
        setError(`${error.message}`);
      } else {
        console.log(error);
        setError(`${error}`);
      }
    }
  };

  if (user?.uid && !logging) {
    return <Navigate to="/account" />;
  }

  return (
    <div className={styles.main}>
      <Link href="/" variant="body2">
        <img alt="logo" src="images/logo.png" />
      </Link>
      <h2>Login</h2>
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
        {/* <FormControlLabel
          control={<Checkbox name="remember" value="remember" />}
          label="Remember me"
        /> */}
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
          onClick={handleGoogleSignIn}
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
