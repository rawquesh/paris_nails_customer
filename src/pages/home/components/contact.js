import { Button, TextField } from "@mui/material";
import React from "react";
import styles from "./css/contact.module.css";

export default function Contact() {
  const iframeLink =
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.229076268091!2d145.31169091582794!3d-37.7612265388129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad631d60c2ce27d%3A0xa575855bb2f60914!2sParis%20Nails!5e0!3m2!1sen!2sin!4v1649144695992!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

  return (
    <div className={styles.main}>
      <div
        className={styles.item}
        dangerouslySetInnerHTML={{ __html: iframeLink }}
      />
      <div className={styles.item}>
        <div className={styles.item2}>
          <h2 className={styles.headline}>Get In Touch</h2>
          <span className={styles.divider}></span>
          <p className={styles.desc}>
            Have any questions? Feel free to use the contact form below to get
            in touch with us. We will answer you as soon as possible!
          </p>
          <MyButton label={"Your name"} auto="name" />
          <MyButton label={"Your email"} auto="email" />
          <MyButton label={"Your phone"} auto="tel" />
          <MyButton label={"Your message"} auto="message" rows={5} />

          <Button className={styles.button} fullWidth variant="contained">
            Send message
          </Button>
        </div>
      </div>
    </div>
  );
}

function MyButton({ label, auto, rows = 1 }) {
  return (
    <TextField
      className={styles.textfield}
      fullWidth
      label={label}
      variant="standard"
      size="small"
      rows={rows}
      autoComplete={auto}
      InputProps={{
        style: {
          fontSize: "16px",
          fontFamily: "Montserrat, sans-serif",
        },
      }}
      InputLabelProps={{
        style: {
          fontSize: "16px",
          fontFamily: "Montserrat, sans-serif",
        },
      }}
    />
  );
}
