import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBModalContent,
  MDBModalDialog,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBModalTitle,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBTypography,
} from "mdb-react-ui-kit";
import Attendance from "../Attendance";
import Feedback from "./Feedback";
import Chart from "chart.js/auto";
import AverageCard from "../AverageCardComponent";
import PredictAverageCard from "../PredictAverageCardComponent";
import RecommendedVideos from "./RecommendedVideos";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import AverageMarksHistory from "../AverageMarksHistory";
import AveragePredictHistory from "../AveragePredictHistory";
import "./Dashboard.css";
import { Visibility, List, Comment, OnlinePrediction, Dvr, AutoStories, AutoGraph} from "@mui/icons-material";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const chartRef = useRef(null);
  const chartRefMarks = useRef(null);
  const chartRefPredict = useRef(null);
  const { userId } = JSON.parse(localStorage.getItem("userData")) || {};
  const urlParts = location.pathname.split("/");
  const studentId = urlParts[2] || userId;
  const [student, setStudent] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [notificationsModal, setNotificationsModal] = useState(false);
  const [showAverageCard, setShowAverageCard] = useState(false);
  const [showPredictAverageCard, setShowPredictAverageCard] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showAverageMarksModal, setShowAverageMarksModal] = useState(false);
  const [showAveragePredictModal, setShowAveragePredictModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const averageMarksHistory = student?.averageMarksHistory;
  const averagePredictHistory = student?.averagePredictHistory;

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const toggleFeedbackModal = async () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

  const toggleAvergeMarksModal = async () => {
    setShowAverageMarksModal(!showAverageMarksModal);
  };

  const toggleAveragePredictModal = async () => {
    setShowAveragePredictModal(!showAveragePredictModal);
  };

  const toggleVideosModal = async () => {
    setShowVideosModal(!showVideosModal);
    try {
      await axios.put(
        `/api/student/markRecommendedVideo/${studentId}`,
        {}
      );
      fetchStudentData();
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/student/${studentId}`);
      setStudent(response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      handleLogout();
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const toggleNotificationsModal = async () => {
    setNotificationsModal(!notificationsModal);
    try {
      await axios.put(
        `/api/student/markNotification/${studentId}`,
        {}
      );
      fetchStudentData();
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  useEffect(() => {
    if (student) {
      // const ctx = document.getElementById(`myChart-${student._id}`);
      const ctxMarks = document.getElementById(`myChartMarks-${student._id}`);
      const ctxPredict = document.getElementById(`myChartPredict-${student._id}`);
      // if (ctx) {
      if (ctxMarks && ctxPredict) {
        // check if the canvas element is ready
        // if (chartRef.current) {
        //   chartRef.current.destroy(); // destroy the previous chart instance if exist
        // }
        // Destroy the previous chart instances if they exist
        if (chartRefMarks.current) {
          chartRefMarks.current.destroy();
        }

        if (chartRefPredict.current) {
          chartRefPredict.current.destroy();
        }
        // chartRef.current = new Chart(ctx, {
        //   type: "line",
        //   data: {
        //     labels: averageMarksHistory.map((item) =>
        //       new Date(item.date).toLocaleDateString()
        //     ),
        //     datasets: [
        //       {
        //         label: "Average Marks History",
        //         data: averageMarksHistory.map((item) => item.average),
        //         fill: false,
        //         borderColor: "rgb(75, 192, 192)",
        //         lineTension: 0.1,
        //       },
        //     ],
        //   },
        // });
        // Create the "Average Marks History" chart
        chartRefMarks.current = new Chart(ctxMarks, {
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

        // Create the "Average Predict History" chart
        chartRefPredict.current = new Chart(ctxPredict, {
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
                borderColor: "rgb(192, 75, 75)", // You can change the color
                lineTension: 0.1,
              },
            ],
          },
        });
      }
    }
  }, [averageMarksHistory, averagePredictHistory, showAverageCard, showPredictAverageCard, student]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleProfileNavigation = () => {
    navigate(`/profile/${studentId}`);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div>
      <Navbar
        student={student}
        showNav={showNav}
        setShowNav={setShowNav}
        handleProfileNavigation={handleProfileNavigation}
        toggleNotificationsModal={toggleNotificationsModal}
        toggleVideosModal={toggleVideosModal}
        handleLogout={handleLogout}
      />
      {alert.show && (
        <div
          className={`alert alert-${alert.type === "success" ? "success" : "error"
          } m-3`}
          role="alert"
        >
          {alert.message}
          <MDBIcon className="ms-2" fas icon="check" />
        </div>
      )}

      {showAverageCard && student && (
        <AverageCard
          setDashboardView={setShowAverageCard}
          fetchStudentData={fetchStudentData}
          student={student}
        />
      )}

      {showPredictAverageCard && student && (
        <PredictAverageCard
          setDashboardView={setShowPredictAverageCard}
          fetchStudentData={fetchStudentData}
          student={student}
        />
      )}
      {student && !showAverageCard && !showPredictAverageCard && (
        <MDBContainer className="dashboard-container mt-5">
          <MDBRow>
            <MDBCol md="3">
              {student && (
                <>
                  <div className="button-container">
                    <MDBBtn
                      color="primary"
                      className="dashboard-button mb-4"
                      style={{ backgroundColor: 'skyblue', color: 'black' }}
                      onClick={() => setShowPredictAverageCard(true)}
                    >
                      <OnlinePrediction /> Predict Final Year Average
                    </MDBBtn>

                    <MDBBtn
                      color="primary"
                      className="dashboard-button mb-4"
                      style={{ backgroundColor: 'skyblue', color: 'black'}}
                      onClick={toggleAveragePredictModal}
                    >
                      <Dvr />  View Predicted Average History
                    </MDBBtn>


                    <MDBBtn
                      color="primary"
                      className="dashboard-button mb-4"
                      style={{ backgroundColor: 'skyblue', color: 'black' }}
                      onClick={() => setShowAverageCard(true)}
                    >
                      <Visibility /> Check Total Average
                    </MDBBtn>

                    <MDBBtn
                      color="primary"
                      className="dashboard-button mb-4"
                      style={{ backgroundColor: 'skyblue', color: 'black' }}
                      onClick={toggleAvergeMarksModal}
                    >
                      <List />  View Total Average History
                    </MDBBtn>

                    <MDBBtn 
                      color="primary" 
                      className="dashboard-button mb-4" 
                      style={{ backgroundColor: 'skyblue', color: 'black' }}
                      onClick={toggleFeedbackModal}>
                      <Comment /> View Feedback
                    </MDBBtn>

                    <MDBBtn 
                      color="primary" 
                      className="dashboard-button mb-4" 
                      style={{ backgroundColor: 'skyblue', color: 'black' }}>
                      <AutoStories /> Submission
                    </MDBBtn>

                    <MDBBtn 
                      color="primary" 
                      className="dashboard-button" 
                      style={{ backgroundColor: 'skyblue', color: 'black' }}>
                      <AutoGraph /> In-Class-Test
                    </MDBBtn>
                  </div>
                </>
              )}
            </MDBCol>

            <MDBCol md="6">
              {showAverageCard && student && (
                <AverageCard
                  className="dashboard-card"
                  setDashboardView={setShowAverageCard}
                  fetchStudentData={fetchStudentData}
                  student={student}
                />
              )}

              {showPredictAverageCard && student && (
                <PredictAverageCard
                  className="dashboard-card"
                  setDashboardView={setShowPredictAverageCard}
                  fetchStudentData={fetchStudentData}
                  student={student}
                />  
              )}

              {student && !showAverageCard && !showPredictAverageCard && (
                <>
                  <MDBTypography tag="h3" style={{ color: "white" }} className="mb-4">
                    Welcome {student?.firstName} {student?.lastName} 👋🏼
                  </MDBTypography>
                  <MDBCard className="dashboard-card mb-4">
                    <MDBCardBody>
                      <MDBCardText><b>Email: {student?.email}</b></MDBCardText>
                      <MDBCardText>
                        <b>First Year Average: {student?.marks.semester1}</b>
                      </MDBCardText>
                      <MDBCardText>
                        <b>Second Year Average: {student?.marks.semester2}</b>
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>

                  {student &&
                    averagePredictHistory &&
                    averagePredictHistory?.length > 0 && (
                    <MDBCard className="mb-4">
                      <MDBCardBody>
                        <>
                          <MDBCardTitle><b>PREDICTED FINAL YEAR AVERAGE PROGRESS CHART</b></MDBCardTitle>
                          {/* <canvas
                            id={`myChart-${student._id}`}
                            style={{ marginTop: "1rem" }}
                          ></canvas> */}
                          <canvas id={`myChartPredict-${student._id}`} style={{ marginTop: "1rem" }}></canvas>
                        </>
                      </MDBCardBody>
                    </MDBCard>
                  )}
                  
                  {student &&
                    averageMarksHistory &&
                    averageMarksHistory?.length > 0 && (
                    <MDBCard className="mb-4">
                      <MDBCardBody>
                        <>
                          <MDBCardTitle><b>TOTAL FINAL AVERAGE PROGRESS CHART</b></MDBCardTitle>
                          {/* <canvas
                            id={`myChart-${student._id}`}
                            style={{ marginTop: "1rem" }}
                          ></canvas> */}
                          <canvas id={`myChartMarks-${student._id}`} style={{ marginTop: "1rem" }}></canvas>
                        </>
                      </MDBCardBody>
                    </MDBCard>
                  )}

                  
                </>
              )}
            </MDBCol>

            <MDBCol md="3">
              <Attendance
                attendance={student?.attendance?.map(
                  (date) => new Date(date)
                )}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}

      <MDBModal
        show={notificationsModal}
        setShow={setNotificationsModal}
        tabIndex="-1"
        className="modal-open"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Notifications</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleNotificationsModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="d-flex justify-content-center align-items-center ">
              <MDBListGroup style={{ minWidth: "22rem" }} light>
                {notifications?.length > 0 &&
                  notifications.map((notification, index) => (
                    <MDBListGroupItem
                      key={index}
                      noBorders
                      color="dark"
                      className="px-3 rounded-3 mb-2"
                    >
                      {notification.message}
                    </MDBListGroupItem>
                  ))}
              </MDBListGroup>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleNotificationsModal}>
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showVideosModal}
        className="modal-open"
        setShow={setShowVideosModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Recommended Videos</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleVideosModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <RecommendedVideos videos={student?.recommendedVideos} />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        className="modal-open"
        show={showFeedbackModal}
        setShow={setShowFeedbackModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent className="average-modal-content">
            <MDBModalHeader>
              <MDBModalTitle style={{ color: "#333" }}><b>Feedbacks</b></MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleFeedbackModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {student?.feedback?.length > 0 ? (
                <Feedback feedback={student.feedback} />
              ) : (
                <MDBTypography note noteColor="danger">
                  <strong>Note:</strong> No feedbacks available
                </MDBTypography>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        className="modal-open"
        show={showAverageMarksModal}
        setShow={setShowAverageMarksModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent className="average-modal-content">
            <MDBModalHeader>
              <MDBModalTitle style={{ color: "#333" }}><b>Average Marks History</b></MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleAvergeMarksModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {averageMarksHistory?.length > 0 ? (
                <AverageMarksHistory
                  marksHistory={student.averageMarksHistory}
                />
              ) : (
                <MDBTypography note noteColor="danger">
                  <strong>Note:</strong> No average marks history available
                </MDBTypography>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal
        className="modal-open"
        show={showAveragePredictModal}
        setShow={setShowAveragePredictModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent className="average-modal-content">
            <MDBModalHeader>
              <MDBModalTitle style={{color: "#333"}}><b>Average Predict History</b></MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleAveragePredictModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {averagePredictHistory?.length > 0 ? (
                <AveragePredictHistory
                  predictHistory={student.averagePredictHistory}
                />
              ) : (
                <MDBTypography note noteColor="danger">
                  <strong>Note:</strong> No average predicted history available
                </MDBTypography>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default StudentDashboard;
