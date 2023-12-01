import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBCardSubTitle,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useNavigate, useLocation } from "react-router-dom";
import StudentRow from "../StudentRow";
import StaffRow from "../StaffRow";
import SubjectRow from "../SubjectRow";
import EventsModal from "../EventsModal";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = JSON.parse(localStorage.getItem("userData")) || {};
  const urlParts = location.pathname.split("/");
  const adminId = urlParts[3] || userId;
  const [students, setStudents] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [newStudentUsername, setNewStudentUsername] = useState("");
  const [newStudentsemester1, setNewStudentsemester1] = useState("");
  const [newStudentsemester2, setNewStudentsemester2] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [selectedSubjectStudent, setSelectedSubjectStudent] = useState(null);

  const [staff, setStaff] = useState([]);
  const [newStaffFirstName, setNewStaffFirstName] = useState("");
  const [newStaffLastName, setNewStaffLastName] = useState("");
  const [newStaffUsername, setNewStaffUsername] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [addOperation, setAddOperation] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [tableToDisplay, setTableToDisplay] = useState("student");

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`/api/admin/${adminId}`);
      setAdmin(response.data);
    } catch (error) {
      handleLogout();
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const fetchAllStaff = async () => {
    try {
      const response = await axios.get(`/api/staff`);
      setStaff(response.data);
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
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

  const handleAddSubject = async () => {
    try {
      await axios.post(
        "/api/admin/subjects",
        {
          name: newSubjectName,
          staff: selectedStaff,
        },
      );
      showAlert(`Sucessfully Added New Degree Program - ${newSubjectName}`, "success");
      fetchAllSubjects();
      fetchAllStaff();
      handleSubjectModalClose();
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await axios.get(
        "/api/admin/subjects"
      );
      setSubjects(response.data);
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const handleSubjectModalClose = () => {
    setNewSubjectName("");
    setSelectedStaff(null);
    setShowSubjectModal(false);
  };

  const handleProfileNavigation = () => {
    navigate(`/profile/admin/${adminId}`);
  };

  const handleAddStudent = async () => {
    const studentData = {
      firstName: newStudentFirstName,
      lastName: newStudentLastName,
      username: newStudentUsername,
      email: newStudentEmail,
      password: newStudentPassword,
      semester1: newStudentsemester1,
      semester2: newStudentsemester2,
      subjectId: selectedSubjectStudent,
    };

    try {
      await axios.post(
        "/api/admin/students",
        studentData
      );
      fetchAllStudents();
      setAddOperation("");
      setShowModal(false);
    } catch (error) {
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const handleAddStaff = async () => {
    const staffData = {
      firstName: newStaffFirstName,
      lastName: newStaffLastName,
      username: newStaffUsername,
      email: newStaffEmail,
      password: newStaffPassword,
    };

    try {
      await axios.post("/api/admin/staff", staffData);
      // handle success
      fetchAllStaff();
      setAddOperation("");
      setShowModal(false);
    } catch (error) {
      // handle error
      showAlert(
        error.response.data.message || error.response.data.msg,
        "error"
      );
    }
  };

  const handleModalClose = () => {
    setNewStudentFirstName("");
    setNewStudentLastName("");
    setNewStudentEmail("");
    setNewStudentPassword("");
    setShowModal(false);
  };

  useEffect(() => {
    fetchAllStudents();
    fetchAdminData();
    fetchAllStaff();
    fetchAllSubjects();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
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
    (student) => student.subjectId === selectedSubject
  );
  const StudentsWithoutSubjects = students.filter(
    (student) => !student.subjectId
  );
  const selectedSubjectName = subjects.find(
    (subject) => subject._id === selectedSubject
  )?.name;

  return (
    <div>
      <EventsModal
        showEventsModal={showEventsModal}
        setShowEventsModal={setShowEventsModal}
        students={students}
        fetchStaffData={fetchAllStaff}
        fetchAllStudents={fetchAllStudents}
      />
      <MDBNavbar expand="lg" light bgColor="light" className="summer-navbar">
        <MDBContainer fluid>
          {
            <MDBNavbarBrand 
              className="summer-navbar-brand"
              onClick={handleProfileNavigation}
              style={{ cursor: "pointer" }}
            >
              {admin?.firstName || "Admin"}
            </MDBNavbarBrand>
          }
          <MDBNavbarToggler
            type="button"
            data-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNav(!showNav)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav className="mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink className="navbar-link">
                  <MDBBtn
                    className="admin-nav-button"
                    onClick={() => setTableToDisplay("staff")}
                  >
                    <MDBIcon fas icon="user-tie" /> Staffs
                  </MDBBtn>
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink className="navbar-link">
                  <MDBBtn
                    className="admin-nav-button"
                    onClick={() => setTableToDisplay("subject")}
                  >
                    <MDBIcon fas icon="book" /> Degree program
                  </MDBBtn>
                </MDBNavbarLink>
              </MDBNavbarItem>
              {tableToDisplay !== "student" && (
                <MDBNavbarItem>
                  <MDBNavbarLink className="navbar-link">
                    <MDBBtn
                      className="admin-nav-button"
                      onClick={() => {
                        setTableToDisplay("student");
                        setSelectedSubject("");
                      }}
                    >
                      <MDBIcon fas icon="user-graduate" /> Student
                    </MDBBtn>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              )}
              <MDBNavbarItem>
                <MDBNavbarLink className="navbar-link">    
                  <MDBBtn
                    className="admin-nav-button"
                    onClick={() => setShowEventsModal(true)}
                  >
                    <MDBIcon fas icon="book" /> Add Event
                  </MDBBtn>
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
            <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
              <MDBNavbarItem className="active">
                <MDBNavbarLink className="navbar-link" aria-current="page" onClick={handleLogout}>
                  Logout
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
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
        {tableToDisplay === "student" && (
          <MDBRow>
            <MDBCol md="13">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>Welcome back, {admin?.firstName}</MDBCardTitle>
                  <MDBCardText>
                    Some quick overview of the student system stats goes here.
                  </MDBCardText>
                  <MDBCardSubTitle>
                    <b>
                      <u>Student Information</u>
                    </b>
                  </MDBCardSubTitle>
                  <MDBCardText>
                    Total number of students: {students.length}
                    <MDBBtn
                      className="ms-3"
                      color="success"
                      onClick={() => {
                        setAddOperation("student");
                        setShowModal(true);
                      }}
                    >
                      <MDBIcon fas icon="plus" /> Add Student
                    </MDBBtn>
                    <br />
                    <div style={{ marginTop: "10px" }}>
                      <span
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        Selected Degree Program:
                      </span>
                      <select
                        className="form-select"
                        style={{ maxWidth: "12rem", display: "inline-block" }}
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="">Select a degree program</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </MDBCardText>
                  {students.length > 0 &&
                  selectedSubject &&
                  selectedSubject !== "" ? (
                      filteredStudents.length > 0 ? (
                        <MDBTable className="mt-3">
                          <MDBTableHead dark>
                            <tr>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Predicted Average</th>
                              <th>Progress History</th>
                              <th>View Students Attendance</th>
                              <th>Update Student Details</th>
                              <th>Delete Student</th>
                            </tr>
                          </MDBTableHead>
                          <MDBTableBody>
                            {filteredStudents.map((student) => (
                              <StudentRow
                                userType="Admin"
                                key={student._id}
                                student={student}
                                fetchAllStudents={fetchAllStudents}
                              />
                            ))}
                          </MDBTableBody>
                        </MDBTable>
                      ) : (
                        <MDBTypography note noteColor="warning">
                          <strong>Note:</strong> No students are allocated to{" "}
                          {selectedSubjectName}
                        </MDBTypography>
                      )
                    ) : (
                      <MDBTypography note noteColor="info">
                        <strong>Info:</strong> Please select a degree program to view the
                      students
                      </MDBTypography>
                    )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        )}
        <MDBContainer className="mt-5">
          {tableToDisplay === "student" &&
            StudentsWithoutSubjects.length > 0 && (
            <MDBRow>
              <MDBCol md="13">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle>Students Without a Degree Program</MDBCardTitle>
                    <MDBCardText>
                        Some quick overview of the students that are not linked
                        with a degree program
                    </MDBCardText>
                    <MDBCardSubTitle>
                      <b>
                        <u>Student Information</u>
                      </b>
                    </MDBCardSubTitle>
                    <MDBCardText>
                        Total number of students:{" "}
                      {StudentsWithoutSubjects.length}
                    </MDBCardText>
                    {StudentsWithoutSubjects.length > 0 && (
                      <MDBTable className="mt-3">
                        <MDBTableHead dark>
                          <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Predicted Average</th>
                            <th>Progress History</th>
                            <th>View Students Attendance</th>
                            <th>Update Student Details</th>
                            <th>Delete Student</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {StudentsWithoutSubjects.map((student) => (
                            <StudentRow
                              userType="Admin"
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
            </MDBRow>
          )}
        </MDBContainer>
        <MDBContainer className="mt-5">
          {tableToDisplay === "staff" && (
            <MDBRow>
              <MDBCol md="13">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardText>
                      Some quick overview of the staff system stats goes here.
                    </MDBCardText>
                    <MDBCardSubTitle>
                      <b>
                        <u>Staff Information</u>
                      </b>
                    </MDBCardSubTitle>
                    <MDBCardText>
                      Total number of staff: {staff.length}
                      <MDBBtn
                        className="ms-3"
                        color="success"
                        onClick={() => {
                          setAddOperation("staff");
                          setShowModal(true);
                        }}
                      >
                        <MDBIcon fas icon="plus" /> Add Staff
                      </MDBBtn>
                    </MDBCardText>
                    {staff.length > 0 && (
                      <MDBTable className="mt-3">
                        <MDBTableHead dark>
                          <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Feedback</th>
                            <th>Provide Feedback</th>
                            <th>Update Staff Details</th>
                            <th>Delete Staff</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {staff.map((staff) => (
                            <StaffRow
                              adminId={adminId}
                              fetchAllStaffs={fetchAllStaff}
                              key={staff._id}
                              subjects={subjects}
                              fetchAllSubjects={fetchAllSubjects}
                              staff={staff}
                            />
                          ))}
                        </MDBTableBody>
                      </MDBTable>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          )}
        </MDBContainer>
        <MDBContainer className="mt-5">
          {tableToDisplay === "subject" && (
            <MDBRow>
              <MDBCol md="13">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardText>
                      Some quick overview of the degree program system stats goes here.
                    </MDBCardText>
                    <MDBCardSubTitle>
                      <b>
                        <u>Degree Program Information</u>
                      </b>
                    </MDBCardSubTitle>
                    <MDBCardText>
                      Total number of degree programs: {subjects.length}
                      <MDBBtn
                        className="ms-3"
                        color="success"
                        onClick={() => setShowSubjectModal(true)}
                      >
                        <MDBIcon fas icon="plus" /> Add Degree Program
                      </MDBBtn>
                    </MDBCardText>
                    {subjects.length > 0 && (
                      <MDBTable className="mt-3">
                        <MDBTableHead dark>
                          <tr>
                            <th>Name</th>
                            <th>Staff</th>
                            <th>Update Degree Program</th>
                            <th>Delete Degree Program</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {subjects.map((subject) => (
                            <SubjectRow
                              key={subject._id}
                              subject={subject}
                              allStaff={staff}
                              fetchAllStaff={fetchAllStaff}
                              fetchAllStudents={fetchAllStudents}
                              fetchAllSubjects={fetchAllSubjects}
                            />
                          ))}
                        </MDBTableBody>
                      </MDBTable>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          )}
        </MDBContainer>
        <MDBModal
          show={showModal}
          getOpenState={(e) => setShowModal(e)}
          staticBackdrop={true}
          keyboard={false}
        >
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>
                  Add New {addOperation === "student" ? "Student" : "Staff"}
                </MDBModalTitle>
                <MDBIcon
                  className="text-danger"
                  fas
                  icon="times"
                  onClick={handleModalClose}
                />
              </MDBModalHeader>
              <MDBModalBody>
                <MDBInput
                  id="firstName"
                  type="text"
                  className="mb-4"
                  label="First Name"
                  value={
                    addOperation === "student"
                      ? newStudentFirstName
                      : newStaffFirstName
                  }
                  onChange={(e) => {
                    if (addOperation === "student") {
                      setNewStudentFirstName(e.target.value);
                    } else {
                      setNewStaffFirstName(e.target.value);
                    }
                  }}
                />
                <MDBInput
                  id="lastName"
                  type="text"
                  className="mb-4"
                  label="Last Name"
                  value={
                    addOperation === "student"
                      ? newStudentLastName
                      : newStaffLastName
                  }
                  onChange={(e) => {
                    if (addOperation === "student") {
                      setNewStudentLastName(e.target.value);
                    } else {
                      setNewStaffLastName(e.target.value);
                    }
                  }}
                />
                <MDBInput
                  id="username"
                  type="text"
                  className="mb-4"
                  label="Username"
                  value={
                    addOperation === "student"
                      ? newStudentUsername
                      : newStaffUsername
                  }
                  onChange={(e) => {
                    if (addOperation === "student") {
                      setNewStudentUsername(e.target.value);
                    } else {
                      setNewStaffUsername(e.target.value);
                    }
                  }}
                />
                <MDBInput
                  id="email"
                  type="email"
                  className="mb-4"
                  label="Email"
                  value={
                    addOperation === "student" ? newStudentEmail : newStaffEmail
                  }
                  onChange={(e) => {
                    if (addOperation === "student") {
                      setNewStudentEmail(e.target.value);
                    } else {
                      setNewStaffEmail(e.target.value);
                    }
                  }}
                />
                <MDBInput
                  id="password"
                  type="password"
                  className="mb-2"
                  label="Password"
                  value={
                    addOperation === "student"
                      ? newStudentPassword
                      : newStaffPassword
                  }
                  onChange={(e) => {
                    if (addOperation === "student") {
                      setNewStudentPassword(e.target.value);
                    } else {
                      setNewStaffPassword(e.target.value);
                    }
                  }}
                />
                {addOperation === "student" && (
                  <>
                    <p className="fw-bolder mt-3 ms-2">Previous Years Averages</p>
                    <MDBInput
                      id="semester1"
                      type="number"
                      className="mb-4"
                      label="First Year Average"
                      value={newStudentsemester1}
                      onChange={(e) => setNewStudentsemester1(e.target.value)}
                    />
                    <MDBInput
                      id="semester2"
                      type="number"
                      className="mb-4"
                      label="Second Year Average"
                      value={newStudentsemester2}
                      onChange={(e) => setNewStudentsemester2(e.target.value)}
                    />
                    <select
                      className="form-select mb-4"
                      value={selectedSubjectStudent}
                      onChange={(e) =>
                        setSelectedSubjectStudent(e.target.value)
                      }
                    >
                      <option value="">Select a degree program</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={handleModalClose}>
                  Cancel
                </MDBBtn>
                <MDBBtn
                  color="success"
                  onClick={
                    addOperation === "student"
                      ? handleAddStudent
                      : handleAddStaff
                  }
                >
                  Save
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
        <MDBModal
          staticBackdrop={true}
          keyboard={false}
          show={showSubjectModal}
          getOpenState={(e) => setShowSubjectModal(e)}
          tabIndex="-1"
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Add New Degree Program</MDBModalTitle>
                <MDBIcon
                  className="text-danger"
                  fas
                  icon="times"
                  onClick={handleSubjectModalClose}
                />
              </MDBModalHeader>
              <MDBModalBody>
                <MDBInput
                  label="Degree Program Name"
                  id="subject-name"
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
                {staff.map((staff) => (
                  <div className="form-check" key={staff._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="staff"
                      id={`staff-${staff._id}`}
                      value={staff._id}
                      checked={selectedStaff === staff._id}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`staffRadio-${staff._id}`}
                    >
                      {staff.firstName}
                    </label>
                  </div>
                ))}
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={handleSubjectModalClose}>
                  Cancel
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  disabled={!newSubjectName || !selectedStaff}
                  onClick={handleAddSubject}
                >
                  Save
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </MDBContainer>
    </div>
  );
};

export default AdminDashboard;
