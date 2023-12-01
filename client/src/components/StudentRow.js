import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalFooter,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
import axios from "axios";
import Chart from "chart.js/auto";
import Attendance from "./Attendance";

const StudentRow = ({
  student,
  fetchAllStudents,
  userType,
  staffId,
}) => {
  const [attendanceMarked, setAttendanceMarked] = React.useState(false);
  const [showProgressChartModal, setShowProgressChartModal] =
    React.useState(false);
  const [averageMarksHistory, setAverageMarksHistory] = React.useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const chartRef = React.useRef(null);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState(null);
  const [selectedSubjectUpdate, setSelectedSubjectUpdate] =
    React.useState(null);
  const [isUpdateEnabled, setIsUpdateEnabled] = React.useState(false);

  const [subjects, setSubjects] = React.useState([]);
  const [updatedStudent, setUpdatedStudent] = React.useState({
    firstName: student.firstName,
    lastName: student.lastName,
    password: "",
    email: student.email,
    semester1: student.marks.semester1,
    semester2: student.marks.semester2,
    semester3: student.marks?.semester3,
    subjectId: student.subjectId,
  });

  const handleInputChange = (event) => {
    setUpdatedStudent({
      ...updatedStudent,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateStudent = async () => {
    const {
      firstName,
      lastName,
      password,
      email,
      semester1,
      semester2,
      semester3,
    } = updatedStudent;

    const editUserDetails = {
      firstName,
      lastName,
      email,
      password,
      semester1,
      semester2,
      semester3,
      subjectId: selectedSubjectUpdate,
    };
    try {
      await axios.put(`/api/student/${student._id}`, editUserDetails);
      alert("Student updated successfully!");
      setShowUpdateModal(false);
      setSelectedSubjectUpdate(null);
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubjectUpdate(event.target.value);
    setUpdatedStudent({
      ...updatedStudent,
      subjectId: event.target.value,
    });
  };

  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          "/api/admin/subjects"
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchSubjects();
  }, []);

  const toggleChartModal = () => {
    setShowProgressChartModal(!showProgressChartModal);
  };

  const toggleFeedbackModal = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

  const toggleAttendanceModal = () => {
    setShowAttendanceModal(!showAttendanceModal);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleFeedbackSubmit = async () => {
    if (feedback && selectedSubject) {
      try {
        await axios.post(
          `/api/staff/students/${student._id}/feedback`,
          { message: feedback, subjectId: selectedSubject, staffId: staffId }
        );
        alert(
          "Feedback submitted successfully for " +
            student.firstName +
            " " +
            student.lastName
        );
        setFeedback("");
        setSelectedSubject(null);
        toggleFeedbackModal();
        fetchAllStudents();
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  };

  const getAverageMarksHistory = async () => {
    try {
      const response = await axios.get(
        `/api/student/${student?._id}/averageMarksHistory`
      );
      setAverageMarksHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttendanceUpdate = async () => {
    try {
      await axios.post(
        `/api/staff/students/${student._id}/attendance`,
        {}
      );
      alert(
        "Attendance updated successfully for " +
          student.firstName +
          " " +
          student.lastName
      );
      setAttendanceMarked(true);
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleUpdateButton = async () => {
    if (updatedStudent.subjectId) {
      const response = await axios.get(
        `/api/admin/subjects/${updatedStudent.subjectId}`
      );
      setSelectedSubjectUpdate(response.data._id); // set the selected option in the dropdown
    }
    setShowUpdateModal(true);
  };

  const handleStudentDelete = async () => {
    try {
      await axios.delete(
        `/api/admin/students/${student._id}`,
      );
      alert(
        "Successfully Deleted Student " +
          student.firstName +
          " " +
          student.lastName
      );
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  React.useEffect(() => {
    if (student) {
      const ctx = document.getElementById(`myChart-${student?._id}`);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: averageMarksHistory.map((item) =>
            new Date(item.date).toLocaleDateString()
          ),
          datasets: [
            {
              label: "Predicted Final Year Average History",
              data: averageMarksHistory.map((item) => item.average),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              lineTension: 0.1,
            },
          ],
        },
      });
    }
  }, [averageMarksHistory]);

  React.useEffect(() => {
    getAverageMarksHistory();
  }, [student]);

  React.useEffect(() => {
    const currentDateString = new Date().toISOString().split("T")[0]; // Gets current date in YYYY-MM-DD format
    const attendanceDates = student.attendance.map(
      (date) => new Date(date).toISOString().split("T")[0]
    ); // Gets attendance dates in YYYY-MM-DD format

    const isAttendanceUpdated = attendanceDates.includes(currentDateString);
    if (isAttendanceUpdated) {
      setAttendanceMarked(true);
    }
  }, [student, attendanceMarked]);

  const renderAverageMarks = () => {
    const { average } = student.marks;
    return average ? (Math.round(average * 100) / 100).toFixed(2) : "N/A";
  };

  React.useEffect(() => {
    setIsUpdateEnabled(
      student.firstName !== updatedStudent.firstName ||
        student.lastName !== updatedStudent.lastName ||
        student.email !== updatedStudent.email ||
        student.marks.semester1 !== updatedStudent.semester1 ||
        student.marks.semester2 !== updatedStudent.semester2 ||
        student.marks.semester3 !== updatedStudent.semester3 ||
        updatedStudent.password !== "" ||
        (selectedSubjectUpdate !== null &&
          selectedSubjectUpdate !== "" &&
          selectedSubjectUpdate !== student.subjectId)
    );
  }, [updatedStudent, student, selectedSubjectUpdate]);

  const renderProgressChartButton = () => {
    const buttonText =
      averageMarksHistory?.length > 0
        ? "View progress chart"
        : "No Progress chart";
    const buttonColor = averageMarksHistory?.length > 0 ? "primary" : "danger";
    const isDisabled = averageMarksHistory?.length === 0;

    return (
      <MDBBtn
        color={buttonColor}
        disabled={isDisabled}
        size="sm"
        onClick={toggleChartModal}
      >
        {buttonText}
      </MDBBtn>
    );
  };

  const renderAttendanceButton = () => {
    const buttonText = attendanceMarked
      ? "Attendance Marked"
      : "Update Attendance";
    const buttonColor = attendanceMarked ? "success" : "primary";
    const isDisabled = attendanceMarked;

    return (
      <MDBBtn
        color={buttonColor}
        disabled={isDisabled}
        size="sm"
        onClick={handleAttendanceUpdate}
      >
        {buttonText}
      </MDBBtn>
    );
  };

  const filteredSubjects = subjects.filter(subject => subject.staff === staffId);

  return (
    <>
      <tr>
        <td>{student.firstName}</td>
        <td>{student.lastName}</td>
        <td>{renderAverageMarks()}</td>
        <td>{renderProgressChartButton()}</td>
        {userType === "Admin" ? (
          <>
            <td>
              <MDBBtn color="primary" size="sm" onClick={toggleAttendanceModal}>
                View Attendance
              </MDBBtn>
            </td>
            <td>
              <MDBBtn color="success" size="sm" onClick={handleUpdateButton}>
                Update Student
              </MDBBtn>
            </td>
            <td>
              <MDBBtn color="danger" size="sm" onClick={handleStudentDelete}>
                Delete Student
              </MDBBtn>
            </td>
          </>
        ) : (
          <>
            <td>
              <MDBBtn color="primary" size="sm" onClick={toggleFeedbackModal}>
                Provide Feedback
              </MDBBtn>
            </td>
            <td>{renderAttendanceButton()}</td>
          </>
        )}
      </tr>
      <MDBModal
        show={showProgressChartModal}
        setShow={setShowProgressChartModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Progress Chart For {student.firstName}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleChartModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {" "}
              <canvas
                id={`myChart-${student._id}`}
                style={{ marginTop: "1rem" }}
              ></canvas>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showAttendanceModal}
        setShow={setShowAttendanceModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Attendance Of {student.firstName}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleAttendanceModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Attendance
                attendance={student.attendance.map((date) => new Date(date))}
              />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showFeedbackModal}
        setShow={setShowFeedbackModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Provide Feedback For {student.firstName}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleFeedbackModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                type="textarea"
                label="Your feedback"
                rows="3"
                value={feedback}
                onChange={handleFeedbackChange}
              />
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <div className="form-check" key={subject._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="subjectRadio"
                      id={`subjectRadio-${subject._id}`}
                      value={subject._id}
                      checked={selectedSubject === subject._id}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`subjectRadio-${subject._id}`}
                    >
                      {subject.name}
                    </label>
                  </div>
                ))
              ) : (
                <MDBTypography note noteColor="danger" className="mt-4">
                  <strong>Note:</strong> Feedback cannot be given if there is no
                  subject
                </MDBTypography>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleFeedbackModal}>
                Close
              </MDBBtn>
              <MDBBtn
                color="primary"
                onClick={handleFeedbackSubmit}
                disabled={!feedback || !selectedSubject}
              >
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Update Details for {student.firstName}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowUpdateModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="First Name"
                name="firstName"
                className="mb-3"
                value={updatedStudent.firstName}
                onChange={handleInputChange}
                placeholder={student.firstName}
              />
              <MDBInput
                label="Last Name"
                name="lastName"
                className="mb-3"
                value={updatedStudent.lastName}
                onChange={handleInputChange}
                placeholder={student.lastName}
              />
              <MDBInput
                label="Password"
                name="password"
                className="mb-3"
                value={updatedStudent.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
              <MDBInput
                label="Email"
                name="email"
                className="mb-3"
                value={updatedStudent.email}
                onChange={handleInputChange}
                placeholder={student.email}
              />
              <MDBInput
                label="First Year Average"
                name="semester1"
                className="mb-3"
                value={updatedStudent.semester1}
                onChange={handleInputChange}
                placeholder={student.marks.semester1}
              />
              <MDBInput
                label="Second Year Average"
                name="semester2"
                className="mb-3"
                value={updatedStudent.semester2}
                onChange={handleInputChange}
                placeholder={student.marks.semester2}
              />
              {/* {student.marks.semester3 && (
                <MDBInput
                  label="Semester 3 Marks"
                  name="semester3"
                  className="mb-3"
                  value={updatedStudent.semester3}
                  onChange={handleInputChange}
                  placeholder={student.marks.semester3}
                />
              )} */}
              <select
                className="form-select mb-4"
                onChange={handleSubjectChange}
                value={selectedSubjectUpdate}
              >
                <option value="">Select a degree program</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </MDBBtn>
              <MDBBtn
                color="primary"
                disabled={!isUpdateEnabled}
                onClick={handleUpdateStudent}
              >
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default StudentRow;
