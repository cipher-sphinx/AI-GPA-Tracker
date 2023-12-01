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
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
} from "mdb-react-ui-kit";
import Chart from "chart.js/auto";
import axios from "axios";

const AverageCard = ({
  student,
  fetchStudentData,
  setDashboardView,
}) => {
  const [showAverageCard, setShowAverageCard] = useState(false);
  const chartRef = useRef(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [modal, setModal] = useState(false);
  const [thirdSemesterMark, setThirdSemesterMark] = useState("");
  const {
    _id,
    firstName,
    marks: { semester1, semester2, semester3, average },
    averageMarksHistory,
  } = student;
  const [isChartCreated, setIsChartCreated] = useState(false);

  const renderAverageMarks = (average) => {
    return average ? (Math.round(average * 100) / 100).toFixed(2) : "N/A";
  };

  const toggle = () => {
    if (chartRef.current) {
      chartRef.current.destroy(); // destroy the chart when the modal is closed
    }
    setModal(!modal);
  };

  const updateMark = () => {
    axios
      .put(
        `/api/student/${_id}/marks`,
        {
          semester3: thirdSemesterMark,
        },
      )
      .then(() => {
        toggle();
        fetchStudentData();
        showAlert("Succuessfuly added semester 3 marks", "success");
      })
      .catch((err) => {
        showAlert(err.response.data.message, "error");
      });
  };
  useEffect(() => {
    if (showAverageCard && student && !isChartCreated) {
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
              labels: averageMarksHistory.map((item) =>
                new Date(item.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Total Average History",
                  data: averageMarksHistory.map((item) => item.average),
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
  }, [averageMarksHistory, showAverageCard, student, isChartCreated]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

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
                  Student - {firstName} Details
                </MDBCardTitle>
                <MDBListGroup className="mt-4">
                  <MDBListGroupItem>
                    <MDBTypography variant="h6">
                      First Year Average: {semester1}
                    </MDBTypography>
                  </MDBListGroupItem>
                  <MDBListGroupItem>
                    <MDBTypography variant="h6">
                      Second Year Average: {semester2}
                    </MDBTypography>
                  </MDBListGroupItem>
                  <MDBListGroupItem>
                    {semester3 ? (
                      <div>
                        <MDBTypography variant="h6">
                          Final Year Average: {semester3}
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
                        Enter Final Year Average
                      </MDBBtn>
                    )}
                  </MDBListGroupItem>
                </MDBListGroup>
                <div className="text-center">
                  <MDBBtn
                    color="primary"
                    className="mt-4"
                    disabled={!semester3}
                    onClick={() => setShowAverageCard(true)}
                  >
                    Check Average
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {showAverageCard && (
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
                          First Year Average: {semester1}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Second Year Average: {semester2}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Third Year Average: {semester3}
                        </MDBTypography>
                        <MDBTypography variant="h6">
                          Total Average: {renderAverageMarks(average)}
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
                  {averageMarksHistory && averageMarksHistory.length > 0 && (
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
              <MDBModalTitle>Enter Final Year Average</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggle}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="d-flex justify-content-center align-items-center ">
              <MDBInput
                wrapperClass="mb-3 w-50"
                label="3rd Semester Mark"
                id="form1"
                type="number"
                onChange={(e) => setThirdSemesterMark(e.target.value)}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggle}>
                Close
              </MDBBtn>
              <MDBBtn color="primary" onClick={updateMark}>
                Save changes
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default AverageCard;
