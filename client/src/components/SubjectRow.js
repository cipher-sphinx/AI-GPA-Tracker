import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBTypography,
} from "mdb-react-ui-kit";

const SubjectRow = ({
  subject,
  allStaff,
  fetchAllSubjects,
  fetchAllStaff,
  fetchAllStudents,
}) => {
  const [staff, setStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [updatedSubject, setUpdatedSubject] = React.useState({
    name: subject.name,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (event) => {
    setUpdatedSubject({
      ...updatedSubject,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateSubject = async () => {
    const { name } = updatedSubject;

    try {
      await axios.put(
        `api/admin/subjects/${subject._id}`,
        { name, staff: selectedStaff }
      );
      alert("Staff updated successfully!");
      fetchAllSubjects();
      fetchAllStaff();
      setShowUpdateModal(false);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSubjectDelete = async () => {
    try {
      await axios.delete(
        `/api/admin/subjects/${subject._id}`
      );
      alert("Successfully Deleted Student " + subject.name);
      fetchAllSubjects();
      fetchAllStaff();
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/staff/${subject.staff}`
        );
        setStaff(response.data);
        setSelectedStaff(response.data._id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [subject]);

  return (
    <>
      <tr>
        <td>{subject.name}</td>
        <td>
          {isLoading ? (
            <MDBTypography note noteColor="warning">
              <strong>Loading...</strong>
            </MDBTypography>
          ) : staff && staff.subjectId === subject._id ? (
            staff.firstName
          ) : (
            <MDBTypography note noteColor="danger">
              <strong>Note:</strong> Staff Has been Removed
            </MDBTypography>
          )}
        </td>
        <td>
          <MDBBtn
            color="success"
            size="sm"
            onClick={() => setShowUpdateModal(true)}
          >
            Update Degree Program
          </MDBBtn>
        </td>
        <td>
          <MDBBtn color="danger" size="sm" onClick={handleSubjectDelete}>
            Delete Degree Program
          </MDBBtn>
        </td>
      </tr>
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
              <MDBModalTitle>Update Details for {subject.name}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowUpdateModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Degree Name"
                name="name"
                className="mb-3"
                value={updatedSubject.name}
                onChange={handleInputChange}
                placeholder={subject.name}
              />
              {allStaff?.map((staff) => (
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
              <MDBBtn
                color="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </MDBBtn>
              <MDBBtn color="primary" onClick={handleUpdateSubject}>
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default SubjectRow;
