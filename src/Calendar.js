import React, { useState } from "react";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const Calendar = ({
  defaultValue = new Date(),
  onChange = () => {},
  format = "MM-DD-YYYY",
  visibility = false
}) => {
  const [state, setState] = useState({
    showCalendarTable: true,
    showMonthTable: false,
    showYearTable: false,
    dateObject: moment(defaultValue),
    allmonths: moment.months(),
    selectedDay: null
  });
  const weekdayshort = moment.weekdaysShort();

  const daysInMonth = () => state.dateObject.daysInMonth();

  const year = () => state.dateObject.format("Y");

  const currentDay = () => parseInt(state.dateObject.format("D"), 10);

  const firstDayOfMonth = () =>
    parseInt(moment(state.dateObject).startOf("month").format("d"), 10);

  const month = () => state.dateObject.format("MMMM");

  const _onChange = (currentDate) => {
    onChange(currentDate.format(format));
  };

  const setMonth = (month) => {
    const monthNum = state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, state.dateObject);
    dateObject = moment(dateObject).set("month", monthNum);
    setState({
      ...state,
      dateObject: dateObject,
      showMonthTable: false,
      showYearTable: false,
      showCalendarTable: true
    });
    _onChange(dateObject);
  };

  const setYear = (year) => {
    let dateObject = Object.assign({}, state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    setState({
      ...state,
      dateObject: dateObject,
      showMonthTable: true,
      showYearTable: false,
      showCalendarTable: false
    });
    _onChange(dateObject);
  };

  const setDay = (e, d) => {
    let dateObject = Object.assign({}, state.dateObject);
    dateObject = moment(dateObject).set("date", d);
    setState({
      ...state,
      dateObject: dateObject,
      selectedDay: d
    });
    _onChange(dateObject);
  };

  const showMonth = (e, month) =>
    setState({
      ...state,
      showMonthTable: true,
      showYearTable: false,
      showCalendarTable: false
    });

  const showYearEditor = () =>
    setState({
      ...state,
      showYearTable: true,
      showMonthTable: false,
      showCalendarTable: false
    });

  const onPrev = () => {
    let unit = "";
    if (state.showYearTable === true) unit = "year";
    else unit = "month";

    setState({
      ...state,
      dateObject: state.dateObject.subtract(1, unit)
    });
  };

  const onNext = () => {
    let unit = "";
    if (state.showYearTable === true) unit = "year";
    else unit = "month";

    setState({
      ...state,
      dateObject: state.dateObject.add(1, unit)
    });
  };

  const resetCalendar = () => {
    setState({
      ...state,
      dateObject: moment(),
      showMonthTable: false,
      showYearTable: false,
      showCalendarTable: true
    });
    onChange(moment().format(format));
  };

  if (!visibility) return <></>;

  return (
    <div className="tail-datetime-calendar">
      <CalendarNav
        onPrev={onPrev}
        onNext={onNext}
        month={month()}
        year={year()}
        isMonthTableVisible={state.showMonthTable}
        isYearTableVisible={state.showYearTable}
        showMonthTable={showMonth}
        showYearTable={showYearEditor}
      />
      <div className="calendar-date">
        {state.showYearTable && (
          <YearTable year={year()} onYearChange={setYear} />
        )}
        {state.showMonthTable && (
          <MonthList
            months={moment.months()}
            onMonthSelected={setMonth}
            currentMonth={month()}
          />
        )}
      </div>
      {state.showCalendarTable && (
        <DayList
          firstDayOfMonth={firstDayOfMonth()}
          daysInMonth={daysInMonth()}
          currentDay={currentDay()}
          onDaySelected={setDay}
          weekdayshort={weekdayshort}
        />
      )}
      <button className="btn-today" onClick={resetCalendar}>
        Today
      </button>
    </div>
  );
};

const CalendarNav = ({
  onPrev,
  onNext,
  month,
  year,
  isMonthTableVisible,
  isYearTableVisible,
  showMonthTable,
  showYearTable
}) => (
  <div className="calendar-navi">
    <span className="calendar-button button-prev" onClick={onPrev}></span>
    {((!isMonthTableVisible && !isYearTableVisible) ||
      (!isYearTableVisible && isMonthTableVisible)) && (
      <span className="calendar-label" onClick={showMonthTable}>
        {month}
      </span>
    )}
    <span className="calendar-label" onClick={showYearTable}>
      {year}
    </span>
    <span className="calendar-button button-next" onClick={onNext}></span>
  </div>
);

const YearTable = ({ year, onYearChange }) => {
  const startDate = moment().set("year", year).subtract(7, "year");
  const endDate = moment().set("year", year).add(7, "year");
  const range = moment.range(startDate, endDate);
  const getYears = Array.from(range.by("year")).map((y) => y.format("Y"));

  const years = getYears.map((_year, index) => (
    <td
      key={index}
      className={`calendar-month ${year === _year ? "current-year" : ""}`}
      onClick={() => onYearChange(_year)}
    >
      <span>{_year}</span>
    </td>
  ));

  let rows = [];
  let cells = [];

  years.forEach((row, i) => {
    if (i % 3 !== 0 || i === 0) cells.push(row);
    else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
  });
  rows.push(cells);

  const yearList = rows.map((cells, index) => <tr key={index}>{cells}</tr>);

  return (
    <table className="calendar-month">
      <thead>
        <tr>
          <th colSpan="4">Select a Year</th>
        </tr>
      </thead>
      <tbody>{yearList}</tbody>
    </table>
  );
};

const MonthList = ({ months, onMonthSelected, currentMonth }) => {
  let _months = months.map((month) => (
    <td
      key={month}
      className={`calendar-month ${
        currentMonth === month ? "current-month" : ""
      }`}
      onClick={() => onMonthSelected(month)}
    >
      <span>{month}</span>
    </td>
  ));
  let rows = [];
  let cells = [];

  _months.forEach((row, i) => {
    if (i % 3 !== 0 || i === 0) cells.push(row);
    else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
  });
  rows.push(cells);

  let list = rows.map((month, i) => <tr key={i}>{month}</tr>);

  return (
    <table className="calendar-month">
      <thead>
        <tr>
          <th colSpan={4}>Select a Month</th>
        </tr>
      </thead>
      <tbody>{list}</tbody>
    </table>
  );
};

const DayList = ({
  firstDayOfMonth,
  daysInMonth,
  currentDay,
  onDaySelected,
  weekdayshort
}) => {
  const blankDays = [...Array(firstDayOfMonth)].map((_, index) => (
    <td className="calendar-day empty" key={`empty-${index}`}>
      {""}
    </td>
  ));

  const _daysInMonth = [...Array(daysInMonth).keys()].map((day, index) => (
    <td
      key={index}
      className={`calendar-day ${day === currentDay - 1 ? "today" : ""}`}
      onClick={(e) => onDaySelected(e, day + 1)}
    >
      <span>{day + 1}</span>
    </td>
  ));

  const totalSlots = [...blankDays, ..._daysInMonth];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) cells.push(row);
    else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) rows.push(cells);
  });

  let days = rows.map((d, i) => <tr key={i}>{d}</tr>);

  const WeekDayShortName = ({ weekdayshort }) =>
    weekdayshort.map((day) => <th key={day}>{day}</th>);

  return (
    <div className="calendar-date">
      <table className="calendar-day">
        <thead>
          <tr>
            <WeekDayShortName weekdayshort={weekdayshort} />
          </tr>
        </thead>
        <tbody>{days}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
