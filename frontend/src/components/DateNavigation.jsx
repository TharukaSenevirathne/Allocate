import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DateNavigation.css';

export const DateNavigation = ({ currentDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  // Normalize currentDate to avoid timezone offset issues
  const normalizedDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const navigateDate = (direction) => {
    const newDate = new Date(
      normalizedDate.getFullYear(),
      normalizedDate.getMonth(),
      normalizedDate.getDate()
    );
    newDate.setDate(newDate.getDate() + direction);
    onDateChange(newDate);
  };

  const handleCalendarChange = (date) => {
    // Ensure date selected has time reset to midnight local
    const selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    onDateChange(selectedDate);
    setShowCalendar(false);
  };

  const formattedDate = format(normalizedDate, "EEEE, do MMMM yyyy");

  return (
    <div className="date-navigation-container">
      <div className="date-navigation">
        <button 
          className="nav-button nav-button-left"
          onClick={() => navigateDate(-1)}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="date-display">
          Today - {formattedDate}
        </div>

        <button 
          className="nav-button"
          onClick={() => navigateDate(1)}
        >
          <ChevronRight size={24} />
        </button>

        <button 
          className="nav-button nav-button-right"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <CalendarIcon size={24} />
        </button>
      </div>

      {showCalendar && (
        <div className="calendar-container">
          <Calendar 
            value={normalizedDate}
            onChange={handleCalendarChange}
            className="calendar"
          />
        </div>
      )}
    </div>
  );
};
