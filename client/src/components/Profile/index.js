import React, { useEffect, useState } from "react";
import {
  MDBTypography,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBModal,
  MDBModalBody,
  MDBModalTitle,
  MDBModalDialog,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalFooter,
  MDBModalContent,
  MDBModalHeader,
  MDBIcon,
} from "mdb-react-ui-kit";
import EditProfile from "./EditProfile";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import RecommendedVideos from "../Dashboard/RecommendedVideos";

const Profile = () => {
  const [student, setStudent] = useState({});
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const { studentId } = useParams();
  const [showNav, setShowNav] = useState(false);
  const [notificationsModal, setNotificationsModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const toggleVideosModal = () => {
    setShowVideosModal(!showVideosModal);
  };

  const toggleNotificationsModal = () => {
    setNotificationsModal(!notificationsModal);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      console.error(error.response.data.message || error.response.data.msg);
    }
  };

  const handleProfileNavigation = () => {
    navigate(`/dashboard/${studentId}`, { state: { userType: "student" } });
  };

  const getStudent = async () => {
    try {
      const response = await axios.get(`/api/student/${studentId}`);
      setStudent(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStudent();
  }, [studentId]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  // Use the student's email as a unique identifier to generate a unique avatar
  useEffect(() => {
    if (student.email) {
      setAvatarUrl(`https://avatars.dicebear.com/api/human/${student.email}.svg`);
    }
  }, [student.email]);

  return (
    <>
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
      </div>
      <div className="d-flex flex-column align-items-center">
        {editing ? (
          <EditProfile
            user={student}
            toggleEdit={toggleEdit}
            getUser={getStudent}
            avatarUrl={avatarUrl}
            userType="student"
          />
        ) : (
          <div className="profile-container">
            {avatarUrl && (
              <img
                style={{ height: "100px", margin: "2rem auto auto 7rem" }}
                src={avatarUrl}
                className="rounded-circle profile-avatar"
                alt="profile"
              />
            )}
            <MDBCard className="shadow profile-card" style={{ width: "22rem", marginTop: "1rem" }}>
              <MDBCardBody>
                <MDBCardTitle>
                  <MDBTypography variant="h4">Profile</MDBTypography>
                </MDBCardTitle>
                <MDBCardText>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="user" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      First Name: {student.firstName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="user" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Last Name: {student.lastName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="envelope" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Email: {student.email}
                    </MDBTypography>
                  </div>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBCard className="shadow profile-card" style={{ width: "22rem", marginTop: "1rem" }}>
              <MDBCardBody>
                <MDBCardTitle>
                  <MDBTypography variant="h4">Previous Years Averages</MDBTypography>
                </MDBCardTitle>
                <MDBCardText>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="star" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      First Year Average: {student.marks?.semester1}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="star" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Second Year Average: {student.marks?.semester2}
                    </MDBTypography>
                  </div>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBBtn
              className="profile-edit-button"
              onClick={toggleEdit}
              style={{ marginTop: "1rem" }}
            >
              Edit Profile
            </MDBBtn>
          </div>
        )}
        <MDBModal
          show={notificationsModal}
          setShow={setNotificationsModal}
          tabIndex="-1"
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
                  {student?.notifications?.map((notification, index) => (
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
      </div>
    </>
  );
};

export default Profile;
