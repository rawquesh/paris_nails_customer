import { Breadcrumbs, Link } from "@mui/material";
import styles from "./css/heading.module.css";

export default function Heading({ title }) {
  return (
    <>
      <div
        style={{
          backgroundImage: "url(images/title-bg.jpg)",
        }}
        className={styles.main}
      >
        <div className={styles.bg}>
          <h1>{title}</h1>
        </div>
      </div>
      <div className={styles.breadcrumbs}>
        <div className={styles.breadcrumbs2}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <p>{title}</p>
          </Breadcrumbs>
        </div>
      </div>
    </>
  );
}
