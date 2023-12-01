import React, { useEffect, useState } from "react";
import {
  MDBTypography,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
} from "mdb-react-ui-kit";
import EditProfile from "./EditProfile";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import NotesModal from "../NotesModal";

const StaffProfile = () => {
  const [staff, setStaff] = useState({});
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const { staffId } = useParams();
  const [avatarUrl, setAvatarUrl] = useState(null); // New state variable for avatar URL
  const [showNav, setShowNav] = useState(false);

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
    navigate(`/dashboard/staff/${staffId}`, { state: { userType: "staff" } });
  };

  const getStaff = async () => {
    try {
      const response = await axios.get(`/api/staff/${staffId}`);
      setStaff(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStaff();
  }, [staffId]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`/api/staff/${staffId}`);
      setStaff(response.data);
    } catch (error) {
      handleLogout();
      console.error(error);
    }
  };

  useEffect(() => {
    if (staff.email) {
      setAvatarUrl(`https://avatars.dicebear.com/api/human/${staff.email}.svg`);
    }
  }, [staff.email]);


  return (
    <>
      <div>
        <Navbar
          showNav={showNav}
          setShowNotesModal={setShowNotesModal}
          setShowNav={setShowNav}
          handleLogout={handleLogout}
          handleProfileNavigation={handleProfileNavigation}
          staff={staff}
          isStaff={true}
        />
        <NotesModal
          showNotesModal={showNotesModal}
          setShowNotesModal={setShowNotesModal}
          fetchStaffData={fetchStaffData}
          staff={staff}
        />
      </div>
      <div className="d-flex flex-column align-items-center">
        {editing ? (
          <EditProfile
            user={staff}
            toggleEdit={toggleEdit}
            avatarUrl={avatarUrl}
            getUser={getStaff}
            userType="staff"
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
                      First Name: {staff.firstName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="user" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Last Name: {staff.lastName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="envelope" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Email: {staff.email}
                    </MDBTypography>
                  </div>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBBtn
              color="primary"
              className="profile-edit-button"
              onClick={toggleEdit}
              style={{ marginTop: "1rem" }}
            >
              Edit Profile
            </MDBBtn>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffProfile;
