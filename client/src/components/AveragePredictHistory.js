import React from "react";
// import axios from "axios";
import {
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import moment from "moment";

const AveragePredictHistory = ({ predictHistory }) => {

  return (
    <div>
      <MDBListGroup>
        {predictHistory?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((predict) => (
          <MDBListGroupItem className="average-modal-item" key={predict._id}>
            <MDBTypography variant="h6">
              Date: {moment(predict.date).format("MMM D YYYY")}
            </MDBTypography>
            <MDBTypography variant="h6">
              Time: {moment(predict.date).format("h:mm a")}
            </MDBTypography>
            <MDBTypography variant="h6">
              Student Age : {predict.studentAge}
            </MDBTypography>
            <MDBTypography variant="h6">
              Student Gender : {predict.studentGender}
            </MDBTypography>
            <MDBTypography variant="h6">
              Mode of Study: {predict.studyMode}
            </MDBTypography>
            <MDBTypography variant="h6">
              Study Tine Allocated (hours/week): {predict.studyTime}
            </MDBTypography>
            <MDBTypography variant="h6">
              Status of Absence: {predict.absent}
            </MDBTypography>
            <MDBTypography variant="h6">
              Extra Support Taken by University: {predict.extraSupport}
            </MDBTypography>
            <MDBTypography variant="h6">
              Repeat/Re-Sit: {predict.repeated}
            </MDBTypography>
            <MDBTypography variant="h6">
              Health Status: {predict.healthStatus}
            </MDBTypography>
            <MDBTypography variant="h6">
              Financial Status: {predict.financialStatus}
            </MDBTypography>
            <MDBTypography variant="h6">
              Alcohol Consumption: {predict.alcoholConsumption}
            </MDBTypography>
            <MDBTypography variant="h6">
              First Year Average: {predict.firstYearAverage}
            </MDBTypography>
            <MDBTypography variant="h6">
              Second Year Average: {predict.secondYearAverage}
            </MDBTypography>
            
            
            
            
            
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>

  );
};

export default AveragePredictHistory;
