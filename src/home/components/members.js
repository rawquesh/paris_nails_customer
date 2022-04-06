import { Grid } from "@mui/material";
import React from "react";
import styles from "./css/members.module.css";

export default function Members() {
  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      container
      direction={"column"}
      className={styles.main}
    >
      <Grid component={"h2"} className={styles.headline} item>
        Meet Our Experts
      </Grid>
      <Grid className={styles.divider} item></Grid>
      <Grid item>
        <p className={styles.desc}>
          We employ the best manicurists and pedicurists in the industry. We
          also educate our own award-winning specialists through constant
          training. Here are the most prominent talents of our team who make
          your dreams come true.
        </p>
      </Grid>
      <Grid
        item
        container
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        {items.map((e) => (
          <Grid
            item
            justifyContent={"center"}
            alignItems={"center"}
            container
            direction={"column"}
            key={e.name}
            className={styles.members}
          >
            <img src={e.image} alt={e.name} />
            <h4>{e.name}</h4>
            <p>{e.desc}</p>
            <span className={styles.divider2 + " " + styles.divider}></span>
            <p>{e.email}</p>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

const items = [
  {
    image: "images/expert-1.jpg",
    name: "Ann Nelson",
    desc: "Founder, Senior Nail Technician",
    email: "anna123@parisnails.com.au",
  },
  {
    image: "images/expert-2.jpg",
    name: "Mary Lucas",
    desc: "Manicurist",
    email: "mary123@parisnails.com.au",
  },
  {
    image: "images/expert-3.jpg",
    name: "Emily Lawrence",
    desc: "Pedicurist",
    email: "emily123@parisnails.com.au",
  },
];
