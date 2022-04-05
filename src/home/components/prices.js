import { Grid } from "@mui/material";
import React from "react";
import styles from "./css/prices.module.css";

export default function Prices() {
  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      container
      className={styles.container}
    >
      <Grid component={"h2"} className={styles.headline} item>
        Special Pricing
      </Grid>
      <Grid className={styles.divider} item></Grid>
      <Grid item>
        <p className={styles.desc}>
          We provide a wide variety of affordable nail and skin treatments for
          you. Below you can learn more about the price range of our services.
        </p>
      </Grid>

      <div className={styles.services}>
        {items.map((e) => (
          <div className={styles.service}>
            <div>
              <h4>{e.title}</h4>
              <p>{e.timeline}</p>
            </div>
            <span>{e.price}</span>
          </div>
        ))}
      </div>
    </Grid>
  );
}

const items = [
  {
    title: "Essential",
    timeline: "60 - 100 Minute Sessions",
    price: "$40.00",
  },
  {
    title: "Elemental Nature",
    timeline: "30 - 40 Minute Sessions",
    price: "$35.00",
  },
  {
    title: "Neroli Spa",
    timeline: "60 - 60 Minute Sessions",
    price: "$30.00",
  },
  {
    title: "Gel Polish",
    timeline: "90 - 120 Minute Sessions",
    price: "$55.00",
  },
  {
    title: "Stone Therapy",
    timeline: "60 - 100 Minute Sessions",
    price: "$40.00",
  },
  {
    title: "Nail Design",
    timeline: "30 - 40 Minute Sessions",
    price: "$35.00",
  },
  {
    title: "Paraffin Treatment",
    timeline: "40 - 50 Minute Sessions",
    price: "$30.00",
  },
  {
    title: "Gel Polish Add-On",
    timeline: "60 - 120 Minute Sessions",
    price: "$45.00",
  },
];
