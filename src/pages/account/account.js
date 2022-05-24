import {
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyAlert } from "../../components/feedback";
import Heading from "../../components/heading";
import { logOut } from "../../utils/auth";
import { FUNCTIONS_URL } from "../../utils/const";
import { useUserAuth } from "../../utils/context/auth_context";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject } from "../../utils/functions/firestore";
import { showToast } from "../../utils/functions/toast";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import { formatToAus, PaymentStatus } from "../staff_time/functions";
import styles from "./style.module.css";

export default function Account() {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [profile, setProfile] = useState();
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [emailWarning, setEmailWarning] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    if (user === "loading") return;
    const q = query(
      collection(db, "bookings"),
      where("user_id", "==", user?.uid),
      orderBy("date_created", "desc")
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

  async function fetchUserData(force = true) {
    if (user !== "loading" && force) {
      try {
        const token = await user.getIdToken();

        const res = await fetch(`${FUNCTIONS_URL}/user?token=${token}`);
        if (res.status === 200) {
          const _user = await res.json();
          setProfile(_user);
        } else {
          setProfile({});
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function signout() {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleGenderChange(_, newGender) {
    if (!showSave) {
      setShowSave(true);
    }
    if (newGender !== null) {
      setProfile((prev) => ({ ...prev, gender: newGender }));
    }
  }

  function handleProfileChange(params) {
    if (!showSave) {
      setShowSave(true);
    }
    if (params.email && !emailWarning) {
      console.log(true);
      setEmailWarning(true);
    }
    setProfile((old) => ({ ...old, ...params }));
  }

  async function handleProfileSubmit() {
    if (user === "loading" || !profile) {
      return;
    }

    if (!profile.name || !profile.phone || !profile.email || !profile.gender) {
      return showToast({ message: "Fill the available fields." });
    }
    if (
      profile.name === "" ||
      profile.phone === "" ||
      profile.email === "" ||
      profile.gender === ""
    ) {
      return showToast({ message: "Fill the available fields." });
    }
    let _phone = profile.phone;

    if (_phone.match(/^[0-9]+$/) !== null) {
      if (!_phone.startsWith("0") && _phone.length === 9) {
        _phone = "0" + _phone;
      } else if (_phone.length !== 10) {
        return showToast({ message: "Invail phone number (e.g. 0987654321)" });
      }
    } else {
      return showToast({ message: "Invail phone number (e.g. 0987654321)" });
    }

    setSubmitted(true);

    const token = await user?.getIdToken(true);

    try {
      await fetch(`${FUNCTIONS_URL}/user?token=${token}`, {
        method: "POST",
        headers: {
          headers: { "Content-type": "text/plain" },
        },
        body: JSON.stringify({ ...profile, phone: _phone }),
      });

      setSubmitted(false);
      setShowSave(false);
      showToast({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      setSubmitted(false);
      showToast({ type: "error", message: "Something went wrong." });
    }
  }

  function BookingsComponent() {
    if (bookings.length === 0) {
      return (
        <div
          style={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {"No bookings were found."}
        </div>
      );
    }
    function formatter(date) {
      return format(formatToAus(date), "dd MMM, hh:mm aaa");
    }

    function BField({ first, second }) {
      return (
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>{first}</p>
          {second}
        </p>
      );
    }

    return (
      <div>
        {bookings.map((e) => (
          <div className={styles.bookingsub}>
            <BField first="Booking ID" second={e.id} />
            <BField
              first="Date Created"
              second={formatter(e.date_created.toDate())}
            />
            <Divider />
            <span>Service details</span>
            <BField first="Name" second={e.service_name} />
            <BField first="Amount" second={e.service_amount + "$"} />
            <BField first="Duration" second={e.duration + "min"} />
            <BField first="Staff" second={e.assigner_name} />
            <BField first="Status" second={PaymentStatus.getAsMsg(e.status)} />
            <Divider />
            <span>Your details</span>
            <BField first="Name" second={e.name} />
            <BField first="Phone" second={e.phone} />
            <BField first="Email" second={e.email} />
            <BField first="Gender" second={e.gender} />
          </div>
        ))}
        <MyAlert
          type="info"
          message="Please contact us if you want to make any changes.(Facebook/Call/Email)"
        />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Heading title="Account" />
      <div className={styles.main}>
        <div className={styles.heading}>Profile</div>
        <div className={styles.inner}>
          {!profile ? (
            [0, 0, 0, 0].map(() => <Skeleton height={"50px"} />)
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={(e) => handleProfileChange({ name: e.target.value })}
                value={profile?.name ?? ""}
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
                  value={profile?.phone ?? ""}
                  onChange={(e) =>
                    handleProfileChange({ phone: e.target.value })
                  }
                />
                <span className={styles.break} />

                <ToggleButtonGroup
                  color="primary"
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
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => handleProfileChange({ email: e.target.value })}
                value={profile?.email ?? ""}
              />
              {emailWarning && (
                <div style={{ marginBottom: "5px" }}>
                  <MyAlert
                    type="info"
                    message="this email is for booking purpose, login email in not changeable."
                    onClose={() => {
                      setEmailWarning(false);
                    }}
                  />
                </div>
              )}

              {showSave && (
                <Button
                  className={styles.btn}
                  fullWidth
                  onClick={handleProfileSubmit}
                  disabled={submitted}
                  variant="contained"
                >
                  {submitted ? <CircularProgress size={30} /> : "Save"}
                </Button>
              )}
              <Button
                sx={{
                  mt: "5px",
                }}
                fullWidth
                onClick={signout}
                variant="outlined"
              >
                {"Logout"}
              </Button>
            </>
          )}

          <Divider />
        </div>

        <span className={styles.break} />
        <div className={styles.heading}>Bookings</div>
        <div className={styles.inner}>
          {isBookingsLoading
            ? [0, 0, 0, 0].map(() => <Skeleton height={"40px"} />)
            : BookingsComponent()}
        </div>
      </div>
      <Divider />
      <Footer />
      <Bottom />
    </>
  );
}
