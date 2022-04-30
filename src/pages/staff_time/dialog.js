import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  isDate,
  isSameMinute,
  isSameSecond,
} from "date-fns";
import { last, pull } from "lodash";
import React, { useEffect, useState } from "react";
import { showToast } from "../../utils/functions/toast";
import { formatToAus } from "./functions";
import styles from "./style.module.css";

export default function MyDateDialog({
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

  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    setSelectedDate(undefined);
    setSelectedWorker(undefined);
  }, [service]);

  function getSortedWorkers() {
    return workers;
  }

  function getSortedDates() {
    const cD = date;

    if (!isDate(date) || !selectedWorker) {
      return [];
    }
    const cWorker = selectedWorker;
    const weekday = parseInt(format(cD, "i"));
    const sDuration = service.duration;

    const wD = cWorker.working_time.filter((e) => e.day === weekday)[0];
    if (!wD) {
      return [];
    }

    const _tl = shopTimeLine.dates.filter((e) => e.weekday === weekday)[0];
    const o = _tl.opening.split(":");
    const c = _tl.closing.split(":");
    const oldtimeList = [];
    if (offDays.includes(weekday)) return [];
    let oT = new Date(
      cD.getFullYear(),
      cD.getMonth(),
      cD.getDate(),
      o[0],
      o[1]
    );
    const cT = new Date(
      cD.getFullYear(),
      cD.getMonth(),
      cD.getDate(),
      c[0],
      c[1]
    );

    while (isBefore(oT, cT)) {
      oldtimeList.push(oT);
      oT = addMinutes(oT, 15);
    }
    // return oldtimeList;

    const timeList = [];
    const _now = new Date();

    for (const time of oldtimeList) {
      if (isAfter(time, _now) && isBefore(time, addDays(_now, 15))) {
        const wF = new Date(
          cD.getFullYear(),
          cD.getMonth(),
          cD.getDate(),
          wD.from.split(":")[0],
          wD.from.split(":")[1]
        );
        const wT = new Date(
          cD.getFullYear(),
          cD.getMonth(),
          cD.getDate(),
          wD.to.split(":")[0],
          wD.to.split(":")[1]
        );
        if (
          (isBefore(wF, time) || isSameSecond(wF, time)) &&
          isAfter(wT, time)
        ) {
          timeList.push(time);
        }
      }
    }

    for (const t of [...timeList]) {
      const _lunch = new Date(
        cD.getFullYear(),
        cD.getMonth(),
        cD.getDate(),
        cWorker.lunch_break.start.split(":")[0],
        cWorker.lunch_break.start.split(":")[1]
      );
      const _lunchEnd = addMinutes(_lunch, cWorker.lunch_break.duration);
      const difference = differenceInMinutes(_lunch, t);
      if (
        (isBefore(_lunch, t) || isSameMinute(_lunch, t)) &&
        isAfter(_lunchEnd, t)
      ) {
        pull(timeList, t);
      }
      // console.log(_lunch, _lunchEnd);
      if (difference < sDuration && difference > 0) {
        pull(timeList, t);
      }

      if (isAfter(addMinutes(t, sDuration), addMinutes(last(timeList), 15))) {
        pull(timeList, t);
      }

      for (const booking of bookings) {
        const bS = formatToAus(booking.scheduled_time.toDate());

        const bE = addMinutes(bS, booking.duration);

        const id = booking.assigner_id;
        const difference = differenceInMinutes(bS, t);

        if (
          (isBefore(bS, t) || isSameMinute(bS, t)) &&
          isAfter(bE, t) &&
          cWorker.id === id
        ) {
          pull(timeList, t);
        }
        if (difference < sDuration && difference > 0 && id === cWorker.id) {
          pull(timeList, t);
        }
      }
    }

    return timeList;
  }

  const sortedDates = getSortedDates();

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
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
            <div>
              {sortedDates.length === 0 ? (
                <div
                  style={{
                    minHeight: "100px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedWorker === undefined
                    ? "Select a staff."
                    : "Nothing to show here"}
                </div>
              ) : (
                sortedDates.map((e) => {
                  return (
                    <Chip
                      key={`${e.toISOString() + selectedWorker?.id}`}
                      label={format(e, "HH:mm")}
                      color={
                        isSameMinute(selectedDate?.date, e) &&
                        selectedWorker?.id === selectedDate?.worker?.id
                          ? "primary"
                          : "default"
                      }
                      sx={{
                        margin: "5px",
                        padding: "0px 3px",
                        "*": {
                          fontSize: "14px",
                        },
                      }}
                      onClick={() => {
                        setSelectedDate({ date: e, worker: selectedWorker });
                      }}
                    />
                  );
                })
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button
          onClick={() => {
            if (!selectedDate) {
              return showToast({
                type: "error",
                message: "Please pick a date.",
              });
            }
            return handleDialogSave(selectedDate, service);
          }}
          autoFocus
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
