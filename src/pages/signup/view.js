import React, { useState } from "react";

import {
  Box,
  Button,
  Link,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import styles from "./style.module.css";
import { logIn, signUp, updateName } from "../../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { MyAlert } from "../../components/feedback";
import { useUserAuth } from "../../utils/context/auth_context";
import withQuery from "../../utils/functions/with_query";

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [error, setError] = useState("");
  const [gender, setGender] = useState("female");
  const [logging, setLogging] = useState(false);

  async function handleSubmit(event) {
    setLogging(true);
    setError(undefined);
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const val = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: data.get("password"),
    };

    console.log(val);

    if (
      val.name === "" ||
      val.email === "" ||
      val.password === "" ||
      val.phone === ""
    ) {
      setError("Please fill the fields.");
      return;
    }

    if (val.phone.match(/^[0-9]+$/) !== null) {
      if (!val.phone.startsWith("0") && val.phone.length === 9) {
        val.phone = "0" + val.phone;
      } else if (val.phone.length !== 10) {
        return setError("Invail phone number (e.g. 0987654321)");
      }
    } else {
      return setError("Invail phone number (e.g. 0987654321)");
    }
    try {
      const user = await signUp(val.email, val.password);
      const token = await user.user.getIdToken();
      await Promise.all([
        fetch(
          "https://australia-southeast1-possystem-db408.cloudfunctions.net/user" +
            withQuery({
              token: token,
              name: val.name,
              gender: gender,
              email: val.email,
              phone: val.phone,
            }),
          {
            method: "POST",
          }
        ),
        logIn(val.email, val.password),
        updateName(user.user, val.name),
      ]);
      navigate("/account", { state: { user: user.user.toJSON() } });
    } catch (error) {
      if ("message" in error) {
        console.log(error.message);
        setError(`${error.message}`);
      } else {
        console.log(error);
        setError(`${error}`);
      }
    }
  }

  function handleGenderChange(_, newGender) {
    if (newGender !== null) {
      setGender(newGender);
    }
  }

  if (user?.uid && !logging) {
    return <Navigate to="/account" />;
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <div className={styles.name}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
          />
          <span className={styles.break} />

          <ToggleButtonGroup
            color="primary"
            value={gender}
            exclusive
            sx={{
              mt: "5px",
              // height : "6px",
              alignItems: "center",
            }}
            fullWidth
            onChange={handleGenderChange}
          >
            <ToggleButton value="male">Male</ToggleButton>
            <ToggleButton value="female">Female</ToggleButton>
          </ToggleButtonGroup>
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
