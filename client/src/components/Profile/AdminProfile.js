import React, { useEffect, useState } from "react";
import {
  MDBTypography,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBContainer,
  MDBCollapse,
} from "mdb-react-ui-kit";
import EditProfile from "./EditProfile";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const { adminId } = useParams();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showNav, setShowNav] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      console.error(
        error.response.data.message || error.response.data.msg,
      );
    }
  };

  const handleProfileNavigation = () => {
    navigate(`/dashboard/admin/${adminId}`, { state: { userType: "admin" } });
  };

  const getAdmin = async () => {
    try {
      const response = await axios.get(`/api/admin/${adminId}`);
      setAdmin(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, [adminId]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  useEffect(() => {
    if (admin.email) {
      setAvatarUrl(`https://avatars.dicebear.com/api/human/${admin.email}.svg`);
    }
  }, [admin.email]);


  return (
    <>
      <div>
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
      </div>
      <div className="d-flex flex-column align-items-center">
        {editing ? (
          <EditProfile
            user={admin}
            avatarUrl={avatarUrl}
            toggleEdit={toggleEdit}
            getUser={getAdmin}
            userType="admin"
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
                      First Name: {admin.firstName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="user" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Last Name: {admin.lastName}
                    </MDBTypography>
                  </div>
                  <div className="profile-card-info">
                    <MDBIcon fas icon="envelope" className="profile-icon" />
                    <MDBTypography variant="h6" tag="span">
                      Email: {admin.email}
                    </MDBTypography>
                  </div>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
            <MDBBtn
              className="profile-edit-button"
              color="primary"
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

export default AdminProfile;
