"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({data}:{data:{title:string;start:Date;end:Date}[]}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div style={{ height: "700px" }}>
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        onView={handleOnChangeView}
        style={{ height: "100%" }}
        min={new Date(2025, 7, 12, 8, 0)} 
        max={new Date(2025, 7, 12, 17, 0)} 
      />
    </div>
  );
};

export default BigCalendar;