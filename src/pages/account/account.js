import {
  Button,
  Divider,
  Skeleton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { logOut } from "../../utils/auth";
import { FUNCTIONS_URL } from "../../utils/const";
import { useUserAuth } from "../../utils/context/auth_context";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject } from "../../utils/functions/firestore";
import { showToast } from "../../utils/functions/toast";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import styles from "./style.module.css";

export default function Account() {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const location = useLocation();

  const [profile, setProfile] = useState({ ...location.state?.user });
  const [isProfileFetching, setIsProfileFetching] = useState(false);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);

  const [bookings, setBookings] = useState([]);

  // const initalProfile = { ...location.state?.user };

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    if (user === "loading") return;
    const q = query(
      collection(db, "bookings"),
      where("user_id", "==", user?.uid)
    );
    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setBookings(_fetched);
      setIsBookingsLoading(false);
    } catch (error) {
      showToast(error.message);
    }
  }

  async function fetchUserData(force = false) {
    if (!location.state?.user) {
      setIsProfileFetching(false);
    }
    if (user !== "loading" && (!location.state?.user || force)) {
      try {
        const token = await user.getIdToken();

        const res = await fetch(
          `${FUNCTIONS_URL}/user?token=${token}`
        );
        if (res.status === 200) {
          const _user = await res.json();
          setIsProfileFetching(true);
          setProfile(_user);
          // initalProfile = _user;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // async function signout() {
  //   try {
  //     await logOut();
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  function handleGenderChange(_, newGender) {
    if (newGender !== null) {
      setProfile((prev) => ({ ...prev, gender: newGender }));
    }
  }

  function BookingsComponent() {
    if (bookings.length === 0) {
      return <div>{"no bookings were found. :("}</div>;
    }
    return (
      <div>
        {bookings.map((e) => (
          <div>{e.service_name}</div>
        ))}
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Heading title="Account" />
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.heading}>Profile</div>
          <TextField
            margin="normal"
            required
            fullWidth
            disabled={!isProfileFetching}
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={profile?.name ?? ""}
          />
          <div className={styles.name}>
            <TextField
              margin="normal"
              required
              fullWidth
              disabled={!isProfileFetching}
              id="phone"
              label="Phone"
              name="phone"
              autoComplete="phone"
              value={profile?.phone ?? ""}
            />
            <span className={styles.break} />

            <ToggleButtonGroup
              color="primary"
              disabled={!isProfileFetching}
              value={profile?.gender ?? ""}
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
            disabled={!isProfileFetching}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={profile?.email ?? ""}
          />
          <Button fullWidth onClick={(e) => {}} variant="contained">
            Save
          </Button>
        </div>

        <span className={styles.break} />
        <div className={styles.inner}>
          <div className={styles.heading}>Bookings</div>
          {isBookingsLoading ? <Skeleton /> : BookingsComponent()}
        </div>
      </div>
      <Footer />
      <Bottom />
    </>
  );
}
