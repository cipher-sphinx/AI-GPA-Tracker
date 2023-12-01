import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Attendance.css';

const Attendance = ({attendance}) => {
  return (
    <div className="attendance-container">
      <div className="title-container">
        <h2><b>ATTENDANCE TRACKER</b></h2>
        <p>This calendar marks your attendance. Green marked dates indicate your presence.</p>
      </div>
      <Calendar 
        tileDisabled={({date, view}) =>
          view === 'month' && 
          !attendance?.some(attendDate => 
            attendDate.getFullYear() === date.getFullYear() &&
            attendDate.getMonth() === date.getMonth() &&
            attendDate.getDate() === date.getDate()
          )
        }
        tileClassName={({ date, view }) => {
          const attendanceClass = view === 'month' &&
          attendance?.some(attendDate => 
            attendDate.getFullYear() === date.getFullYear() &&
            attendDate.getMonth() === date.getMonth() &&
            attendDate.getDate() === date.getDate() 
          ) ? "highlight" : "";
          return `calendar-tile ${attendanceClass}`;
        }}
      />
    </div>
  );
};

export default Attendance;
