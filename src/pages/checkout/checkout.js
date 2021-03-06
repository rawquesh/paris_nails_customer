import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { FUNCTIONS_URL } from "../../utils/const";
import { useUserAuth } from "../../utils/context/auth_context";
import { getDateAsString } from "../../utils/functions/math";
import { showToast } from "../../utils/functions/toast";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import styles from "./style.module.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const userInfo = location.state?.user;

  const [name, setName] = useState(userInfo?.name ?? "");
  const [phone, setPhone] = useState(userInfo?.phone ?? "");
  const [gender, setGender] = useState(userInfo?.gender ?? "");
  const [email, setEmail] = useState(userInfo?.email ?? "");

  const [sync, setSync] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const services = location.state?.services;

  useEffect(() => {
    console.log(services);
  }, []);

  async function handleSubmit() {
    if (user === "loading") {
      return;
    }

    if (name === "" || phone === "" || email === "" || gender === "") {
      return showToast({ message: "Fill the available fields." });
    }
    let _phone = phone;

    if (_phone.match(/^[0-9]+$/) !== null) {
      if (!_phone.startsWith("0") && _phone.length === 9) {
        _phone = "0" + _phone;
      } else if (_phone.length !== 10) {
        return showToast({ message: "Invail phone number (e.g. 0987654321)" });
      }
    } else {
      return showToast({ message: "Invail phone number (e.g. 0987654321)" });
    }

    try {
      const token = await user?.getIdToken(true);
      const bookingsModel = services.map((e) => {
        const _d = format(e.selected_date, "yyyy-MM-dd'T'HH:mm:ss.SSS+10:00");
        return {
          name: name,
          phone: _phone,
          email: email,
          gender: gender,
          payment_method: "shop",
          status: "atShop",
          service_id: e.id,
          assigner_id: e.selected_worker.id,
          assigner_name: e.selected_worker.name,
          scheduled_date: getDateAsString(new Date(e.selected_date)),
          scheduled_time: _d,
        };
      });
      const promises = [
        fetch(
          `${FUNCTIONS_URL}/bookings`,

          {
            method: "POST",
            headers: {
              headers: { "Content-type": "text/plain" },
            },
            body: JSON.stringify({
              bookings: bookingsModel,
              token: token,
            }),
          }
        ),
      ];

      if (sync) {
        promises.push(
          fetch(`${FUNCTIONS_URL}/user?token=${token}`, {
            method: "POST",
            headers: {
              headers: { "Content-type": "text/plain" },
            },
            body: JSON.stringify({
              token: token,
              name: name,
              gender: gender,
              email: email,
              phone: _phone,
            }),
          })
        );
      }
      setSubmitted(true);

      const res = await Promise.all(promises);
      console.log(res[0].json());

      navigate("/", { replace: true });
    } catch (error) {
      if ("message" in error) {
        showToast({ message: `${error.message}` });
      } else {
        showToast({ message: `${error}` });
      }
      navigate("/", { replace: true });
    }
  }

  if (!location.state?.services) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <NavBar />
      <Heading title="Checkout" />
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.heading}>Services</div>
          <div className={styles.box}>
            {services.map((e, i) => (
              <div key={e.id}>
                <div className={styles.service}>
                  <div className={styles.schild}>{e.name}</div>
                  <div className={styles.schild}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p>{e.duration}</p>
                      <QueryBuilderOutlinedIcon
                        color="primary"
                        fontSize="small"
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ width: "1.3vh" }} />
                      <p>{e.price}</p>
                      <AttachMoneyIcon color="primary" fontSize="small" />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: "var(--theme-color2)",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  {`${e.selected_worker?.name}, ${formatDate5(
                    e.selected_date
                  )}`}
                </div>
                {services.length - 1 !== i && <Divider />}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></div>
          </div>
          <div className={styles.heading}>Your info</div>
          <div className={`${styles.box}`}>
            <div className={`${styles.TextField}`}>
              <TextField
                margin="normal"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
                autoComplete="name"
                name="name"
              />

              <span className={styles.break} />

              <TextField
                margin="normal"
                required
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                label="Phone (eg. 0987654321)"
                autoComplete="phone"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                name="phone"
              />
            </div>
            <div className={`${styles.TextField}`}>
              <TextField
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                autoComplete="email"
              />

              <span className={styles.break} />
              <ToggleButtonGroup
                color="primary"
                value={gender}
                exclusive
                sx={{
                  mt: "5px",
                  alignItems: "center",
                }}
                fullWidth
                onChange={(_, newGender) => {
                  if (newGender !== null) {
                    setGender(newGender);
                  }
                }}
              >
                <ToggleButton value="male">Male</ToggleButton>
                <ToggleButton value="female">Female</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <FormControlLabel
                // className={styles.checkbox}
                control={
                  <Checkbox
                    onChange={(e) => setSync(e.target.checked)}
                    checked={sync}
                  />
                }
                label="Sync with profile"
              />
            </div>
          </div>

          <div className={styles.heading}>Payment option</div>
          <div className={styles.box}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormControlLabel
                className={styles.checkbox}
                control={<Checkbox checked={true} />}
                label="Pay at shop"
              />
              <FormControlLabel
                className={styles.checkbox}
                control={<Checkbox disabled />}
                label="Stripe (Credit Card)"
              />
              <FormControlLabel
                className={styles.checkbox}
                control={<Checkbox disabled />}
                label="Paypal"
              />
            </div>
          </div>
        </div>
        <div className={styles.main2}>
          <div className={styles.heading}>Summary</div>
          <div className={styles.box}>
            {services.map((e) => (
              <div key={e.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{e.name}</div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ width: "1.3vh" }} />
                      <p>{e.price}</p>
                      <AttachMoneyIcon color="primary" fontSize="small" />
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 className={styles.heading}>Total</h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 className={styles.heading}>
                  {`${services.reduce(function (prev, cur) {
                    return prev + cur.price;
                  }, 0)}`}
                </h3>
                <AttachMoneyIcon color="primary" />
              </div>
            </div>
            <br />
            <Button
              fullWidth
              disabled={submitted}
              onClick={handleSubmit}
              variant="contained"
            >
              {submitted ? <CircularProgress size={30} /> : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
      <Bottom />
    </div>
  );
}

function formatDate5(date) {
  return format(date, "HH:mm dd-LLL");
}
