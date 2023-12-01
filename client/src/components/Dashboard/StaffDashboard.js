import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import StudentRow from "../StudentRow";
import { useNavigate, useLocation } from "react-router-dom";
import NotesModal from "../NotesModal";
import EventsModal from "../EventsModal";
import RecommendedVideos from "../VideosModal";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = JSON.parse(localStorage.getItem("userData")) || {};
  const urlParts = location.pathname.split("/");
  const staffId = urlParts[3] || userId;
  const [staff, setStaff] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [students, setStudents] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`/api/staff/${staffId}`);
      setStaff(response.data);
    } catch (error) {
      handleLogout();
      showAlert(
        error.response?.data.message || error.response?.data.msg,
        "error"
      );
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`/api/student`);
      setStudents(response.data);
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  useEffect(() => {
    fetchStaffData();
    fetchAllStudents();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleProfileNavigation = () => {
    navigate(`/profile/staff/${staffId}`);
  };

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


  const filteredStudents = students.filter(
    (student) => student?.subjectId === staff?.subjectId
  );

  return (
    <div>
      <Navbar
        showNav={showNav}
        setShowNav={setShowNav}
        handleLogout={handleLogout}
        handleProfileNavigation={handleProfileNavigation}
        setShowNotesModal={setShowNotesModal}
        staff={staff}
        isStaff={true}
      />
      <NotesModal
        showNotesModal={showNotesModal}
        setShowNotesModal={setShowNotesModal}
        fetchStaffData={fetchStaffData}
        staff={staff}
      />
      <EventsModal
        showEventsModal={showEventsModal}
        setShowEventsModal={setShowEventsModal}
        fetchStaffData={fetchStaffData}
        students={students}
        fetchAllStudents={fetchAllStudents}
      />
      <RecommendedVideos
        showVideosModal={showVideosModal}
        setShowVideosModal={setShowVideosModal}
        fetchStaffData={fetchStaffData}
        students={students}
        fetchAllStudents={fetchAllStudents}
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
      <MDBContainer className="mt-5">
        <MDBRow>
          <MDBCol md="13">
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>Welcome back, {staff?.firstName}</MDBCardTitle>
                <MDBCardText>
                  Some quick overview of the system stats goes here.
                </MDBCardText>
                <MDBCardText>
                  Total number of students: {filteredStudents.length}
                </MDBCardText>
                {filteredStudents.length > 0 && (
                  <MDBTable className="mt-3">
                    <MDBTableHead dark>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Predicted Average</th>
                        <th>Progress History</th>
                        <th>Feedback</th>
                        <th>Attendance</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {filteredStudents.map((student) => (
                        <StudentRow
                          staffId={staffId}
                          key={student._id}
                          student={student}
                          fetchAllStudents={fetchAllStudents}
                        />
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol className="mt-5">
            <MDBCard style={{ maxWidth: "22rem" }}>
              <MDBCardBody>
                <MDBCardTitle>Upcoming Events</MDBCardTitle>
                <MDBCardText>
                  List of upcoming events or exams here.
                </MDBCardText>
                <MDBBtn onClick={() => setShowEventsModal(true)}>
                  View All Events
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol className="mt-5">
            <MDBCard style={{ maxWidth: "22rem" }}>
              <MDBCardBody>
                <MDBCardTitle>Recommended Videos</MDBCardTitle>
                <MDBCardText>List of recommended video links here.</MDBCardText>
                <MDBBtn onClick={() => setShowVideosModal(true)}>
                  View All Recommendations
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default StaffDashboard;
