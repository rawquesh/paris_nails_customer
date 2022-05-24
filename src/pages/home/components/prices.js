import { Button, Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  SHOP_SERVICES_TITLE,
  SHOP_SPECIAL_SERVICES,
} from "../../../utils/const";
import styles from "./css/prices.module.css";

export default function Prices() {
  const navigate = useNavigate();

  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      container
      className={styles.container}
    >
      <Grid component={"h2"} className={styles.headline} item>
        Special Services
      </Grid>
      <Grid className={styles.divider} item></Grid>
      <Grid item>
        <p className={styles.desc}>{SHOP_SERVICES_TITLE}</p>
      </Grid>

      <div className={styles.services}>
        {SHOP_SPECIAL_SERVICES.map((e) => (
          <div key={e.title} className={styles.service}>
            <div>
              <h4>{e.title}</h4>
              <p>{e.timeline}</p>
            </div>
            <span>{e.price}</span>
          </div>
        ))}
      </div>

      {/* <Grid item  > */}
      <Button
        className={styles.button}
        variant="contained"
        onClick={() => {
          navigate("/services");
        }}
      >
        View more
      </Button>

      {/* </Grid> */}
    </Grid>
  );
}
