import React from "react";
// import axios from "axios";
import {
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import moment from "moment";

const AverageMarksHistory = ({ marksHistory }) => {
  const renderAverageMarks = (average) => {
    return average ? (Math.round(average * 100) / 100).toFixed(2) : "N/A";
  };

  return (
    <div>
      <MDBListGroup>
        {marksHistory?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((marks) => (
          <MDBListGroupItem className="average-modal-item" key={marks._id}>
            <MDBTypography variant="h6">
              Date: {moment(marks.date).format("MMM D YYYY")}
            </MDBTypography>
            <MDBTypography variant="h6">
              Time: {moment(marks.date).format("h:mm a")}
            </MDBTypography>
            <MDBTypography variant="h6">
              First Year Average: {marks.semester1}
            </MDBTypography>
            <MDBTypography variant="h6">
              Second Year Average: {marks.semester2}
            </MDBTypography>
            <MDBTypography variant="h6">
              Third Year Average: {marks.semester3}
            </MDBTypography>
            <MDBTypography variant="h6">
              Total Average: {renderAverageMarks(marks.average)}
            </MDBTypography>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>

  );
};

export default AverageMarksHistory;
