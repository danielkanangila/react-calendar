import React, { useState } from "react";
import "./styles.css";
import Calendar from "./Calendar";
import { ReactComponent as CalendarIcon } from "./assets/date_range_black_24dp.svg";

export default function App() {
  const [showCalendar, setCalendar] = useState(false);
  return (
    <div className="App">
      <CalendarIcon
        style={{ cursor: "pointer" }}
        onClick={() => setCalendar(!showCalendar)}
      >
        Calendar
      </CalendarIcon>
      <Calendar
        onChange={(date) => console.log(date)}
        visibility={showCalendar}
      />
    </div>
  );
}
