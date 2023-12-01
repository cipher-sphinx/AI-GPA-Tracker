import React, { useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBModal,
  MDBModalBody,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalFooter,
  MDBInput,
  MDBCardSubTitle,
} from "mdb-react-ui-kit";
import axios from "axios";

const StaffRow = ({
  adminId,
  staff,
  fetchAllStaffs,
  subjects,
  fetchAllSubjects,
}) => {
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [showInputFeedbackModal, setShowInputFeedbackModal] =
    React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [subjectFeedbacks, setSubjectFeedbacks] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [feedback, setFeedback] = React.useState("");
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
  const [updatedStaff, setUpdatedStaff] = React.useState({
    firstName: staff.firstName,
    lastName: staff.lastName,
    password: "",
    email: staff.email,
    subjectId: staff.subjectId,
  });

  const [selectedSubject, setSelectedSubject] = useState(
    updatedStaff.subjectId
  );

  const handleInputChange = (event) => {
    setUpdatedStaff({
      ...updatedStaff,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setUpdatedStaff({
      ...updatedStaff,
      subjectId: event.target.value,
    });
  };

  React.useEffect(() => {
    setIsUpdateEnabled(
      staff.firstName !== updatedStaff.firstName ||
        staff.lastName !== updatedStaff.lastName ||
        staff.email !== updatedStaff.email ||
        updatedStaff.password !== "" ||
        (selectedSubject !== null &&
          selectedSubject !== "Select a subject" &&
          selectedSubject !== staff.subjectId)
    );
  }, [updatedStaff, staff, selectedSubject]);

  const selectedSubjectName = subjects.find(
    (subject) => subject._id === selectedSubject
  )?.name;

  const handleUpdateStaff = async () => {
    const { firstName, lastName, password, email } = updatedStaff;

    const editUserDetails = {
      firstName,
      lastName,
      email,
      password,
      subjectId: selectedSubject,
    };
    try {
      await axios.put(`/api/staff/${staff._id}`, editUserDetails);

      if (selectedSubject) {
        await axios.put(
          `/api/admin/subjects/${selectedSubject}`,
          { staff: staff._id, name: selectedSubjectName },
        );
      }

      alert("Staff and Degree Program updated successfully!");
      setShowUpdateModal(false);
      setSelectedSubject(null);
      fetchAllSubjects();
      fetchAllStaffs();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleUpdateButton = async () => {
    if (updatedStaff.subjectId) {
      const response = await axios.get(
        `/api/admin/subjects/${updatedStaff.subjectId}`,
      );
      setSelectedSubject(response.data._id); // set the selected option in the dropdown
    }
    setShowUpdateModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (feedback) {
      try {
        await axios.post(
          `/api/admin/staff/${staff._id}/feedback`,
          { message: feedback, adminId: adminId },
        );
        alert(
          "Feedback submitted successfully for " +
            staff.firstName +
            " " +
            staff.lastName
        );
        setFeedback("");
        toggleFeedbackModal();
        fetchAllStaffs();
      } catch (error) {
        console.error("There was an error!", error);
      }
    }
  };

  const handleStaffDelete = async () => {
    try {
      await axios.delete(`/api/admin/staff/${staff._id}`);
      alert(
        "Successfully Deleted Staff " + staff.firstName + " " + staff.lastName
      );
      fetchAllStaffs();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const openFeedbackModal = () => {
    fetchFeedbacks();
    setShowFeedbackModal(true);
  };

  const toggleFeedbackModal = () => {
    setShowInputFeedbackModal(!showInputFeedbackModal);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `/api/admin/staff/${staff._id}/feedback`
      );

      const subjects = Object.keys(response.data);

      const subjectFeedbacksPromises = subjects.map(async (subjectId) => {
        const subjectResponse = await axios.get(
          `/api/admin/subjects/${subjectId}`
        );

        return {
          subject: subjectResponse.data,
          count: response.data[subjectId],
        };
      });

      setSubjectFeedbacks(await Promise.all(subjectFeedbacksPromises));

      const historyResponse = await axios.get(
        `/api/admin/staff/${staff._id}/feedback/v2`
      );

      const feedbackHistoryPromises = historyResponse.data.map(
        async (feedback) => {
          const staffResponse = await axios.get(
            `/api/staff/${feedback.staffId}`
          );

          const subjectResponse = await axios.get(
            `/api/admin/subjects/${feedback.subjectId}`
          );

          return {
            ...feedback,
            staffName: `${staffResponse.data.firstName} ${staffResponse.data.lastName}`,
            subject: subjectResponse.data,
          };
        }
      );

      setFeedbackHistory(await Promise.all(feedbackHistoryPromises));
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <>
      <tr>
        <td>{staff.firstName}</td>
        <td>{staff.lastName}</td>
        <td>
          <MDBBtn color="primary" size="sm" onClick={openFeedbackModal}>
            View Feedbacks Given
          </MDBBtn>
        </td>
        <td>
          <MDBBtn color="success" size="sm" onClick={toggleFeedbackModal}>
            Provide Feedback
          </MDBBtn>
        </td>
        <td>
          <MDBBtn color="success" size="sm" onClick={handleUpdateButton}>
            Update Staff
          </MDBBtn>
        </td>
        <td>
          <MDBBtn color="danger" size="sm" onClick={handleStaffDelete}>
            Delete Staff
          </MDBBtn>
        </td>
      </tr>
      <MDBModal
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        staticBackdrop={true}
        keyboard={false}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Update Details for {staff.firstName}
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
                value={updatedStaff.firstName}
                onChange={handleInputChange}
                placeholder={staff.firstName}
              />
              <MDBInput
                label="Last Name"
                name="lastName"
                className="mb-3"
                value={updatedStaff.lastName}
                onChange={handleInputChange}
                placeholder={staff.lastName}
              />
              <MDBInput
                label="Email"
                name="email"
                className="mb-3"
                value={updatedStaff.email}
                onChange={handleInputChange}
                placeholder={staff.email}
              />
              <MDBInput
                label="Password"
                name="password"
                className="mb-3"
                value={updatedStaff.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
              <select
                className="form-select mb-4"
                onChange={handleSubjectChange}
                value={selectedSubject}
              >
                <option>Select a Degree program</option>
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
                onClick={handleUpdateStaff}
                disabled={!isUpdateEnabled}
              >
                Save
              </MDBBtn>
            </MDBModalFooter>
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
                Feedbacks Given by {staff.firstName}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowFeedbackModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <h5>Feedbacks Given For Each Degree Program</h5>
              {subjectFeedbacks.map(({ subject, count }) => (
                <MDBCard key={subject?._id} className="mb-2">
                  <MDBCardBody>
                    <MDBCardTitle>{subject?.name}</MDBCardTitle>
                    <MDBCardText>Feedbacks Given: {count}</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              ))}
              <h5 className="mt-5">History of Feedbacks Given</h5>
              {feedbackHistory.map(({ message, subject }) => (
                <MDBCard key={subject?._id} className="mb-2">
                  <MDBCardBody>
                    <MDBCardSubTitle>
                      <h5>{message}</h5>
                    </MDBCardSubTitle>
                    <MDBCardSubTitle>Subject: {subject?.name}</MDBCardSubTitle>
                  </MDBCardBody>
                </MDBCard>
              ))}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => setShowFeedbackModal(false)}
              >
                Close
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showInputFeedbackModal}
        setShow={setShowInputFeedbackModal}
        tabIndex="-1"
        staticBackdrop={true}
        keyboard={false}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Provide Feedback For {staff.firstName}
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
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleFeedbackModal}>
                Close
              </MDBBtn>
              <MDBBtn
                color="primary"
                onClick={handleFeedbackSubmit}
                disabled={!feedback}
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

export default StaffRow;
