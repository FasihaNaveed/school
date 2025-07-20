"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

// ⭐ Style fix for slightly bigger event box
const eventStyleGetter = (event: any) => {
  return {
    style: {
      backgroundColor: event.color,
      color: event.textColor,
      borderRadius: "6px",
      padding: "4px",
      fontSize: "12px",
      minHeight: "60px", // Increased from 40px → 60px ✅
      whiteSpace: "normal",
      display: "flex",
      alignItems: "center",
    },
  };
};

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div style={{ height: "700px" }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        onView={handleOnChangeView}
        style={{ height: "100%" }}
        min={new Date(2025, 7, 12, 8, 0)}
        max={new Date(2025, 7, 12, 17, 0)}
        eventPropGetter={eventStyleGetter} // ⭐ Applied
      />
    </div>
  );
};

export default BigCalendar;
