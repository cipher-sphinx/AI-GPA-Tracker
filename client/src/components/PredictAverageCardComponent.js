import React, { useEffect, useRef, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBListGroup,
  MDBListGroupItem,
  MDBTypography,
  MDBBtn,
  MDBCardText,
  //MDBInput,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Chart from "chart.js/auto";
import axios from "axios";
import "./PACC.css";

const PredictAverageCard = ({
  setDashboardView,
  fetchStudentData,
  student,
}) => { //   const [showAverageCard, setShowAverageCard] = useState(false);
  const [showPredictAverageCard, setShowPredictAverageCard] = useState(false);
  const chartRef = useRef(null); // const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [modal, setModal] = useState(false);
  const [studentAgeValue, setStudentAgeValue] = useState("");
  const [studentGenderValue, setStudentGenderValue] = useState("");
  const [studyTimeValue, setStudyTimeValue] = useState("");
  const [absentValue, setAbsentValue] = useState("");
  const [healthStatusValue, setHealthStatusValue] = useState("");
  const [financialStatusValue, setFinancialStatusValue] = useState("");
  const [alcoholConsumptionValue, setAlcoholConsumptionValue] = useState("");
  const [studyModeValue, setStudyModeValue] = useState("");
  const [repeatedValue, setRepeatedValue] = useState("");
  const [extraSupportValue, setExtraSupportValue] = useState("");
  const [firstYearAverageValue, setFirstYearAverageValue] = useState("");
  const [secondYearAverageValue, setSecondYearAverageValue] = useState("");
  const [thirdYearAverageValue, setThirdYearAverageValue] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);
  // const [studentAge] = useState("");
  // const [studyTime] = useState("");
  // const [absent] = useState("");
  // const [healthStatus] = useState("");
  // const [studyMode] = useState("");
  // const [repeated] = useState("");
  // const [extraSupport] = useState("");
  // const [firstYearAverage] = useState("");
  // const [secondYearAverage] = useState("");
  

  const {
    _id,
    firstName, // predict: { studentAge, studyTime, absent, healthStatus, studyMode, repeated, extraSupport, firstYearAverage, secondYearAverage, thirdYearAverage },
    averagePredictHistory,
  } = student;
  const [isChartCreated, setIsChartCreated] = useState(false);

  const toggle = () => {
    if (chartRef.current) {
      chartRef.current.destroy(); // destroy the chart when the modal is closed
    }
    setModal(!modal);
  };

  const handlePredict = () => {
    // Validate absent input
    if (!absentValue) {
      alert('Please select a valid option for Absent.');
      return;
    }

    // Validate health status input
    if (!healthStatusValue) {
      alert('Please select a valid option for Health Status.');
      return;
    }

    // Validate health status input
    if (!financialStatusValue) {
      alert('Please select a valid option for Financial Status.');
      return;
    }

    // Validate health status input
    if (!alcoholConsumptionValue) {
      alert('Please select a valid option for Alcohol Consumption.');
      return;
    }

    // Validate study mode input
    if (!studyModeValue) {
      alert('Please select a valid option for Mode of Study.');
      return;
    }

    // Validate repeat input
    if (!repeatedValue) {
      alert('Please select a valid option for Repeated.');
      return;
    }

    // Validate extra support input
    if (!extraSupportValue) {
      alert('Please select a valid option for Extra Support Taken by University.');
      return;
    }

    // Validate health status input
    if (!studentGenderValue) {
      alert('Please select a valid option for Student Gender.');
      return;
    }

    // Validate student age input
    const studentAgeInt = parseInt(studentAgeValue);
    if (isNaN(studentAgeInt) || studentAgeInt < 2 || studentAgeInt > 29) {
      alert('Please enter a valid student age between 2 and 29.');
      return;
    }

    // Validate study time input
    const studyTimeFloat = parseFloat(studyTimeValue);
    if (isNaN(studyTimeFloat) || studyTimeFloat < 0 || studyTimeFloat > 24) {
      alert('Please enter a valid study time between 0 and 24 hours.');
      return;
    }

    // Validate first year average input
    const firstYearAverageFloat = parseFloat(firstYearAverageValue);
    if (isNaN(firstYearAverageFloat) || firstYearAverageFloat < 0 || firstYearAverageFloat > 100) {
      alert('Please enter a valid first year average between 0 and 100.');
      return;
    }

    // Validate second year average input
    const secondYearAverageFloat = parseFloat(secondYearAverageValue);
    if (isNaN(secondYearAverageFloat) || secondYearAverageFloat < 0 || secondYearAverageFloat > 100) {
      alert('Please enter a valid second year average between 0 and 100.');
      return;
    }


    // Make the API call to the backend to get the prediction http://localhost:3030/predict
    axios.post(
      `/api/student/${_id}/predict`,
      { 
        input: { 
          absent : absentValue, 
          healthStatus : healthStatusValue, 
          financialStatus : financialStatusValue,
          alcoholConsumption : alcoholConsumptionValue,
          studyMode : studyModeValue, 
          repeated : repeatedValue, 
          extraSupport : extraSupportValue, 
          studentGender : studentGenderValue,
          studentAge : studentAgeInt, 
          studyTime : studyTimeFloat, 
          firstYearAverage : firstYearAverageFloat, 
          secondYearAverage: secondYearAverageFloat, 
        } 
      },
    )
      .then((response) => {
        setStudentAgeValue(response.data.student.predict.studentAge);
        setStudentGenderValue(response.data.student.predict.studentGender);
        setStudyTimeValue(response.data.student.predict.studyTime);
        setAbsentValue(response.data.student.predict.absent);
        setHealthStatusValue(response.data.student.predict.healthStatus);
        setFinancialStatusValue(response.data.student.predict.financialStatus);
        setAlcoholConsumptionValue(response.data.student.predict.alcoholConsumption);
        setStudyModeValue(response.data.student.predict.studyMode);
        setRepeatedValue(response.data.student.predict.repeated);
        setExtraSupportValue(response.data.student.predict.extraSupport);
        setFirstYearAverageValue(response.data.student.predict.firstYearAverage);
        setSecondYearAverageValue(response.data.student.predict.secondYearAverage);
        setThirdYearAverageValue(response.data.student.predict.thirdYearAverage);
        toggle();
        fetchStudentData();
        setIsEditing(!isEditing);
        alert("Succuessfuly added Predict Inputs!", "success");
      })
      .catch((error) => {
        console.error('Prediction error:', error);
        alert('An error occurred while making predictions in the client.', error);
      });
  };
  useEffect(() => {
    if (showPredictAverageCard && student && !isChartCreated) {
      const ctx = document.getElementById(`myChart-${student?._id}`);
      if (ctx) {
        // check if the canvas element is ready
        if (chartRef.current) {
          chartRef.current.destroy(); // destroy the previous chart instance if exist
        }
        setTimeout(() => {
          chartRef.current = new Chart(ctx, {
            type: "line",
            data: {
              labels: averagePredictHistory.map((item) =>
                new Date(item.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Predicted Final Year Average History",
                  data: averagePredictHistory.map((item) => item.thirdYearAverage),
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  lineTension: 0.1,
                },
              ],
            },
          });
          setIsChartCreated(true);
        }, 500);
      }
    }
  }, [averagePredictHistory, showPredictAverageCard, student, isChartCreated]);

  // const showAlert = (message, type) => {
  //   setAlert({ show: true, message, type });
  //   setTimeout(() => {
  //     setAlert({ show: false, message: "", type: "" });
  //   }, 5000);
  // };

  return (
    <div>
      {alert.show && (
        <div
          className={`alert alert-${
            alert.type === "success" ? "success" : "error"
          } m-3`}
          role="alert"
        >
          {alert.message}
          <MDBIcon className="ms-2" fas icon="check" />
        </div>
      )}
      <MDBContainer className="mt-5">

        <MDBBtn color="success" onClick={() => setDashboardView(false)}>
          <MDBIcon fas icon="angle-left" /> Back
        </MDBBtn>

        <MDBRow className="d-flex justify-content-center">
          <MDBCol md="4">
            <MDBCard className="mb-4">
              <MDBCardBody>

                <MDBCardTitle>
                  Student: {firstName}
                </MDBCardTitle>
                <MDBCardTitle>
                  Predict Final Year Average
                </MDBCardTitle>

                <MDBListGroup className="mt-4"> 

                  <MDBListGroupItem>
                    {isEditing ? (
                      <div>
                        <MDBTypography variant="h6">
                          Student Age : {studentAgeValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Student Gender : {studentGenderValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Mode of Study: {studyModeValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Study Time Allocated (hours/week): {studyTimeValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Status of Absence: {absentValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Extra Support Taken by University: {extraSupportValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Repeat/Re-Sit: {repeatedValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Health Status: {healthStatusValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Financial Status: {financialStatusValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Alcohol Consumption: {alcoholConsumptionValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          First Year Average: {firstYearAverageValue}
                        </MDBTypography>

                        <MDBTypography variant="h6">
                          Second Year Average: {secondYearAverageValue}
                        </MDBTypography>     

                        <MDBTypography>
                          <MDBIcon
                            fas
                            icon="pen"
                            style={{ marginLeft: "4.5rem", cursor: "pointer" }}
                            onClick={toggle}
                          />
                        </MDBTypography>
                      </div>
                    ) : (
                      <MDBBtn color="primary" onClick={toggle}>
                        Enter Inputs For Prediction
                      </MDBBtn>
                    )}
                  </MDBListGroupItem>  
                </MDBListGroup>

                <div className="text-center"> { /* Buttons */}
                  <MDBBtn
                    color="primary"
                    className="mt-4"
                    // disabled={!thirdYearAverage}
                    onClick={() => setShowPredictAverageCard(true)}
                  >
                    Predict Average
                  </MDBBtn> {/* <div>{thirdYearAverage !== null && <p>Predicted Third Year Average Marks: {thirdYearAverage}</p>}</div> */}
                </div>

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {showPredictAverageCard && (
          <MDBRow className="d-flex justify-content-center">
            <MDBCol md="4">
              <MDBCard className="mb-3">
                <MDBCardBody>
                  <MDBCardText>
                    <MDBListGroup className="mt-4">
                      <MDBListGroupItem>
                        <MDBCardTitle className="mb-3">
                          <u>Details</u>
                        </MDBCardTitle>
                        <MDBTypography variant="h6">
                          Student Age : {studentAgeValue}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Student Gender : {studentGenderValue}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Mode of Study : {studyModeValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Study Time Allocated (hours/week) : {studyTimeValue}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Status of Absence : {absentValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Extra Support Taken by University : {extraSupportValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Repeat/Re-Sit : {repeatedValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Health Status : {healthStatusValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Financial Status : {financialStatusValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Alcohol Consumption : {alcoholConsumptionValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          First Year Average : {firstYearAverageValue}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Second Year Average : {secondYearAverageValue} 
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Third Year Average : {thirdYearAverageValue} 
                        </MDBTypography>
                      </MDBListGroupItem>
                    </MDBListGroup>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard className="mb-3">
                <MDBCardBody>
                  {averagePredictHistory && averagePredictHistory.length > 0 && (
                    <>
                      <MDBCardTitle>Progress History Chart</MDBCardTitle>
                      <canvas
                        id={`myChart-${student._id}`}
                        style={{ marginTop: "1rem" }}
                      ></canvas>
                    </>
                  )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        )}
      </MDBContainer>
      <MDBModal
        show={modal}
        setShow={setModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Enter Inputs to Predict Final Year Average</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggle}
              ></MDBBtn>
            </MDBModalHeader>
            {/* <MDBModalBody className="d-flex justify-content-center align-items-center ">
              <MDBInput
                variant="h6"
                wrapperClass="mb-3 w-50"
                label="Student Average"
                id="form1"
                type="number"
                value={studentAgeValue}
                onChange={(e) => setStudentAgeValue(e.target.value)}
                required
              />
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Student Gender:
                    <select value={studentGenderValue} onChange={(e) => setStudentGenderValue(e.target.value)}>
                      <option value="" disabled selected>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Mode of Study:
                    <select value={studyModeValue} onChange={(e) => setStudyModeValue(e.target.value)}>
                      <option value="" disabled selected>Select Mode of Study</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBInput
                variant="h6"
                wrapperClass="mb-3 w-50"
                label="Study Time Allocated"
                id="form1"
                type="number"
                value={studyTimeValue}
                onChange={(e) => setStudyTimeValue(e.target.value)}
                required
              />
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Absent:
                    <select value={absentValue} onChange={(e) => setAbsentValue(e.target.value)}>
                      <option value="" disabled selected>Select Absent</option>
                      <option value="Not-At-All">Not At All</option>
                      <option value="Rarely">Rarely</option>
                      <option value="Frequently">Frequently</option>
                      <option value="Mostly">Mostly</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Extra Support Taken by University:
                    <select value={extraSupportValue} onChange={(e) => setExtraSupportValue(e.target.value)}>
                      <option value="" disabled selected>Select Extra Support Taken or Not</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Repeated:
                    <select value={repeatedValue} onChange={(e) => setRepeatedValue(e.target.value)}>
                      <option value="" disabled selected>Select Repeated</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Health Status:
                    <select value={healthStatusValue} onChange={(e) => setHealthStatusValue(e.target.value)}>
                      <option value="" disabled selected>Select Health Status</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Financial Status:
                    <select value={financialStatusValue} onChange={(e) => setFinancialStatusValue(e.target.value)}>
                      <option value="" disabled selected>Select Financial Status</option>
                      <option value="Well-Off">Well-Off</option>
                      <option value="Comfortable">Comfortable</option>
                      <option value="Above-Average">Above-Average</option>
                      <option value="Average">Average</option>
                      <option value="Below-Average">Below-Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBTypography variant="h6">
                <div>
                  <label>
                    Alcohol Consumption:
                    <select value={alcoholConsumptionValue} onChange={(e) => setAlcoholConsumptionValue(e.target.value)}>
                      <option value="" disabled selected>Select Alcohol Consumption</option>
                      <option value="Not-Drinking">Not-Drinking</option>
                      <option value="Rarely">Rarely</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Moderately">Moderately</option>
                      <option value="Regularly">Regularly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </label>
                </div>
              </MDBTypography>
              <br/>
              <MDBInput
                variant="h6"
                wrapperClass="mb-3 w-50"
                label="First Year Average"
                id="form1"
                type="number"
                step="0.01"
                value={firstYearAverageValue}
                onChange={(e) => setFirstYearAverageValue(e.target.value)}
                required
              />
              <br/>
              <MDBInput
                variant="h6"
                wrapperClass="mb-3 w-50"
                label="Second Year Average"
                id="form1"
                type="number"
                step="0.01"
                value={secondYearAverageValue}
                onChange={(e) => setSecondYearAverageValue(e.target.value)}
                required
              />
              <br/> 
            </MDBModalBody> */}
            <MDBModalBody>
              <div className="container">
                <div className="row">

                  <div className="mb-3">
                    <label htmlFor="studentAgeValue" className="form-label">
                      Student Age:
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="studentAgeValue"
                      value={studentAgeValue}
                      onChange={(e) => setStudentAgeValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studentGenderValue" className="form-label">
                      Student Gender:
                    </label>
                    <select
                      className="form-select"
                      id="studentGenderValue"
                      value={studentGenderValue}
                      onChange={(e) => setStudentGenderValue(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studyModeValue" className="form-label">
                     Mode of Study:
                    </label>
                    <select
                      className="form-select"
                      id="studyModeValue"
                      value={studyModeValue}
                      onChange={(e) => setStudyModeValue(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Mode of Study</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studyTimeValue" className="form-label">
                      Study Time Allocated (hours/week):
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="studyTimeValue"
                      value={studyTimeValue}
                      onChange={(e) => setStudyTimeValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="absentValue" className="form-label">
                     Status of Absence:
                    </label>
                    <select
                      className="form-select"
                      id="absentValue"
                      value={absentValue}
                      onChange={(e) => setAbsentValue(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Status of Absence</option>
                      <option value="Not-At-All">Not At All</option>
                      <option value="Rarely">Rarely</option>
                      <option value="Frequently">Frequently</option>
                      <option value="Mostly">Mostly</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="extraSupportValue" className="form-label">
                     Extra Support Taken by University:
                    </label>
                    <select
                      className="form-select"
                      id="extraSupportValue"
                      value={extraSupportValue}
                      onChange={(e) => setExtraSupportValue(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Extra Support Taken by University</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="repeatedValue" className="form-label">
                     Repeat/Re-Sit:
                    </label>
                    <select
                      className="form-select"
                      id="repeatedValue"
                      value={repeatedValue}
                      onChange={(e) => setRepeatedValue(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Repeat</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="healthStatusValue" className="form-label">
                     Health Status:
                    </label>
                    <select
                      className="form-select"
                      id="healthStatusValue"
                      value={healthStatusValue}
                      onChange={(e) => setHealthStatusValue(e.target.value)}
                      required
                    >
                      <option value="" disabled selected>Select Health Status</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="financialStatusValue" className="form-label">
                     Financial Status:
                    </label>
                    <select
                      className="form-select"
                      id="financialStatusValue"
                      value={financialStatusValue}
                      onChange={(e) => setFinancialStatusValue(e.target.value)}
                      required
                    >
                      <option value="" disabled selected>Select Financial Status</option>
                      <option value="Well-Off">Well-Off</option>
                      <option value="Comfortable">Comfortable</option>
                      <option value="Above-Average">Above-Average</option>
                      <option value="Average">Average</option>
                      <option value="Below-Average">Below-Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="alcoholConsumptionValue" className="form-label">
                     Alcohol Consumption:
                    </label>
                    <select
                      className="form-select"
                      id="alcoholConsumptionValue"
                      value={alcoholConsumptionValue}
                      onChange={(e) => setAlcoholConsumptionValue(e.target.value)}
                      required
                    >
                      <option value="" disabled selected>Select Alcohol Consumption</option>
                      <option value="Not-Drinking">Not-Drinking</option>
                      <option value="Rarely">Rarely</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Moderately">Moderately</option>
                      <option value="Regularly">Regularly</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="firstYearAverageValue" className="form-label">
                      First Year Average:
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="firstYearAverageValue"
                      value={firstYearAverageValue}
                      onChange={(e) => setFirstYearAverageValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="secondYearAverageValue" className="form-label">
                      Second Year Average:
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="secondYearAverageValue"
                      value={secondYearAverageValue}
                      onChange={(e) => setSecondYearAverageValue(e.target.value)}
                      required
                    />
                  </div>

                </div>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggle}>
                Close
              </MDBBtn>
              <MDBBtn color="primary" onClick={handlePredict}>
                Save changes
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      
    </div>
  );
};

export default PredictAverageCard;