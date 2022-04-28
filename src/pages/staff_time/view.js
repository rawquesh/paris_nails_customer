import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/heading";
import { db } from "../../utils/firebaseConfig";
import { documentDataToObject } from "../../utils/functions/firestore";
import { showToast } from "../../utils/functions/toast";
import useQuery from "../../utils/functions/use_query";
import Footer, { Bottom } from "../home/components/footer";
import { NavBar } from "../home/components/header";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  addDays,
  addMinutes,
  isAfter,
  isBefore,
  isDate,
  isSameSecond,
} from "date-fns";

import styles from "./style.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import { randomInteger } from "../../utils/functions/math";
import { getDateAsString, getDateAsString2, PaymentStatus } from "./functions";

export default function ChooseStaffTime() {
  const navigate = useNavigate();
  const queryParam = useQuery();

  const idsFromParam = queryParam.get("ids").split("|");

  const [services, setServices] = useState([]);
  const [shopTimeLine, setShopTimeLine] = useState();
  const [offDays, setOffDays] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerError, setDatePickerError] = useState(null);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceForDialog, setServiceForDialog] = useState();

  useEffect(() => {
    fetchServices();
    fetchShopTimeline();
    fetchBookings(selectedDate);
    fetchShopWorker();
    fetchOffDays();
    // eslint-disable-next-line
  }, []);

  // Fetch Requests =======================================================

  async function fetchServices() {
    if (idsFromParam.length > 10) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "services"),
      where(documentId(), "in", idsFromParam)
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setServices(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }
  async function fetchBookings(date) {
    setIsBookingsLoading(true);
    const q = query(
      collection(db, "bookings"),
      where("status", "in", [
        PaymentStatus.approved,
        PaymentStatus.atShop,
        PaymentStatus.completed,
      ]),
      where("scheduled_date", "==", getDateAsString(date))
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setBookings(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
    setIsBookingsLoading(false);
  }

  async function fetchShopTimeline() {
    const q = query(
      collection(db, "timeline"),
      orderBy("date_created", "desc"),
      limit(1)
    );

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject)[0];
      setShopTimeLine(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  async function fetchShopWorker() {
    const q = query(collection(db, "workers"), orderBy("date_joined", "desc"));

    try {
      const snapshot = await getDocs(q);
      const _fetched = snapshot.docs.map(documentDataToObject);
      setWorkers(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }
  async function fetchOffDays() {
    const query = doc(db, "shop", "offday");

    try {
      const snapshot = await getDoc(query);
      const _fetched = snapshot.data();
      setOffDays(_fetched);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    }
  }

  //  Functions ====================================================================

  function handleChange(newValue) {
    setSelectedDate(newValue);
    if (isDate(newValue)) {
      let now = new Date();
      let later = addDays(now, 16);
      let newDate = newValue;

      newDate.setHours(23, 59, 59, 59);

      const validate = isAfter(newDate, now) && isBefore(newDate, later);

      if (validate) {
        fetchBookings(newDate);
      }
    }
  }

  function handlePreviousButton() {
    navigate(-1);
  }
  function handleNextButton() {}

  function handleDialogOpen(_service) {
    // serviceForDialog = _service;
    setServiceForDialog(_service);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleDialogSave() {
    // setDialogOpen(false);
  }

  let canDialogOpen =
    isBookingsLoading ||
    shopTimeLine === undefined ||
    workers.length === 0 ||
    services.length === 0;

  // Components ======================================================================

  function ServicesSection() {
    const heights = [];
    for (let index = 0; index < idsFromParam.length; index++) {
      heights.push(randomInteger(30, 50));
    }

    return (
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "15.5px",
                borderBottom: "1.4px solid var(--theme-color)",
                backgroundColor: "var(--theme-color)",
              }}
            >
              <TableCell
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "15.5px",
                }}
              >
                Services
              </TableCell>
              <TableCell
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "15.5px",
                }}
                align="right"
              >
                Staff And Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length !== 0
              ? services.map((service) => (
                  <TableRow
                    key={service.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "*": { fontFamily: "Montserrat" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {service.name}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        style={{ fontSize: "12px" }}
                        variant="outlined"
                        disabled={canDialogOpen}
                        onClick={() => {
                          handleDialogOpen(service);
                        }}
                      >
                        Choose
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : heights.map((e) => (
                  <TableRow key={e + randomInteger(1, 1000)}>
                    <TableCell>
                      <Skeleton width={"100%"} height={e} />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        width={"100%"}
                        key={e + randomInteger(1, 1000)}
                        height={e}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  function BuildTitle({ title, widget }) {
    return (
      <div style={{ marginRight: "10px", marginBottom: "10px" }}>
        <h3 className={styles.midHeading}>{title}</h3>
        {widget}
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Heading title="Choose a day & time" />
      <div className={styles.main}>
        {/* <DatePickerSection /> */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <BuildTitle title="Choose a day" />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              minDate={new Date()}
              maxDate={addDays(new Date(), 15)}
              label="Pick a date"
              inputFormat="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={datePickerError}
                  error={datePickerError !== null}
                  size="small"
                />
              )}
              onError={(r, v) => {
                let error = null;
                if (r === "maxDate") {
                  error = "Date should be under 15 days from now";
                } else if (r === "minDate") {
                  error = "You can not pick older dates.";
                } else if (r === "invalidDate") {
                  error = "Pick a vaild date.";
                } else if (typeof r === String) {
                  error = r;
                }
                setDatePickerError(error);
              }}
            />
          </LocalizationProvider>
        </div>

        <Divider variant="middle" />
        {/* <BuildTitle title="Choose staff and time" /> */}
        <ServicesSection />
        <Divider variant="middle" />
        <div className={styles.Button}>
          <Button onClick={handlePreviousButton} variant="contained">
            {"< Previous"}
          </Button>
          <Button onClick={handleNextButton} variant="contained">
            {"Next >"}
          </Button>
        </div>
        <Divider variant="middle" />
      </div>

      <MyDialog
        key={serviceForDialog}
        service={serviceForDialog}
        bookings={bookings}
        workers={workers}
        shopTimeLine={shopTimeLine}
        dialogOpen={dialogOpen}
        handleDialogSave={handleDialogSave}
        handleDialogClose={handleDialogClose}
        selectedDate={selectedDate}
        offDays={offDays}
      />

      <Footer />
      <Bottom />
    </>
  );
}

function MyDialog({
  service,
  workers,
  shopTimeLine,
  bookings,
  date,
  dialogOpen,
  handleDialogSave,
  handleDialogClose,
  offDays,
}) {
  const [selectedWorker, setSelectedWorker] = useState();

  const [selectedDates, setSelectedDates] = useState([]);

  function getSortedWorkers() {
    return workers;
  }

  function getSortedDates() {
    let cD = date;
    let _tl = shopTimeLine.dates.filter(
      (e) => e.weekday === cD.getDay() + 1
    )[0];
    let cWorker = selectedWorker;
    let o = _tl.opening.split(":");
    let c = _tl.closing.split(":");
    let wD = cWorker.workingTime.filter((e) => e.day === cD.getDay() + 1)[0];
    let oldtimeList = [];
    if (offDays.includes(cD.getDay() + 1)) return [];
    let oT = new Date(
      cD.getFullYear(),
      cD.getMonth(),
      cD.getDate(),
      o[0],
      o[1]
    );
    let cT = oT.setHours(o[0], o[1]);

    while (isBefore(oT, cT)) {
      oT = addMinutes(oT, 15);
    }

    let timeList = [];
    let _now = new Date();

    for (const time of oldtimeList) {
      if (isAfter(time, _now)) {
        if (wD !== null) {
          let wF = MyDateTime.toAus(
            cD.year,
            cD.month,
            cD.day,
            wD.from.split(":")[0],
            wD.from.split(":")[1]
          );
          let wT = MyDateTime.toAus(
            cD.year,
            cD.month,
            cD.day,
            wD.to.split(":")[0],
            wD.to.split(":")[1],
          );
          if (
            (isBefore(wF, time) || isSameSecond(wF, time)) &&
            isAfter(wT, time)
          ) {
            timeList.add(time);
          }
        } else {
          timeList.add(time);
        }
      }
    }

    

  }

  useLayoutEffect(() => {
    setSelectedDates([]);
    setSelectedWorker(undefined);
  }, [service]);

  // useEffect(() => {

  // }, [service]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={styles.dialog}
    >
      <DialogTitle id="alert-dialog-title">
        {"Choose staff and date."}
      </DialogTitle>
      <DialogContent>
        {service === undefined ? (
          "something went wrong"
        ) : (
          <>
            <div>
              {getSortedWorkers().map((e) => {
                return (
                  <Chip
                    key={e.id}
                    label={e.name}
                    color={selectedWorker === e ? "primary" : "default"}
                    sx={{
                      margin: "5px",
                      padding: "0px 3px",
                      "*": {
                        fontSize: "14px",
                      },
                    }}
                    onClick={() => {
                      setSelectedWorker(e);
                    }}
                  />
                );
              })}
            </div>
            <Divider />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button onClick={handleDialogSave} autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
