import { Button, Divider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import Heading from "../../components/heading";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";
import styles from "./style.module.css";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useUserAuth } from "../../utils/context/auth_context";

export default function Checkout() {
  const location = useLocation();
  const { user } = useUserAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const services = [...location.state.services];

  async function handleSubmit() {
    console.log(name, phone);
  }

  async function fetchUserData() {
    if (user === "loading") return;
    try {
      const token = await user?.getIdToken(true);
      const res = await fetch(
        `https://australia-southeast1-possystem-db408.cloudfunctions.net/user?token=${token}`
      );
      if (res.status === 200) {
        const user = await res.json();
        if (user) {
          setName(user.name);
          setPhone(user.phone);
        }
      }
    } catch (error) {
      console.log(error);
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
                  Ariana, 03:30PM, 02 June 2022
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
          <div className={`${styles.box} ${styles.TextField}`}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              autoComplete="name"
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
            />
          </div>
          <div className={styles.heading}>Payment option</div>
          <div className={styles.box}></div>
        </div>
        <div className={styles.main2}>
          <div className={styles.heading}>Summary</div>
          <div className={styles.box}>
            {services.map((e, i) => (
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
            <Button fullWidth onClick={handleSubmit} variant="contained">
              {"Checkout"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
      <Bottom />
    </div>
  );
}
