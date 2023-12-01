import React, { useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBModalBody,
  MDBModalTitle,
  MDBModalHeader,
  MDBModalContent,
  MDBModalDialog,
  MDBModal,
  MDBTypography,
} from "mdb-react-ui-kit";
import Feedback from "./Dashboard/Feedback";

const Navbar = (props) => {
  const {
    student,
    showNav,
    setShowNav,
    handleProfileNavigation,
    toggleNotificationsModal,
    toggleVideosModal,
    handleLogout,
    isStaff,
    staff,
    setShowNotesModal,
  } = props;

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const toggleFeedbackModal = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

  const handleColor = { color: "white", cursor: "pointer"};

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light" className="summer-navbar">
        <MDBContainer fluid>
          <MDBNavbarBrand onClick={handleProfileNavigation} className="summer-navbar-brand">
            {!isStaff ? student?.firstName || "Student" : staff?.firstName || "Staff"}
          </MDBNavbarBrand>
          <MDBNavbarToggler aria-label="Toggle navigation" onClick={() => setShowNav(!showNav)}>
            <MDBIcon icon="bars" fas style={handleColor} />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav className="mb-2 mb-lg-0">
              {isStaff ? (
                <>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" style={handleColor} onClick={() => setShowNotesModal(true)}>
                      <MDBIcon fas icon="sticky-note" style={handleColor} /> Notes
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink className="navbar-link" style={handleColor} onClick={toggleFeedbackModal}>
                      <MDBIcon fas icon="comment" style={handleColor} /> View Feedback
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </>
              ) : (
                <>
                  <MDBNavbarItem>
                    <MDBNavbarLink aria-current="page"  className="navbar-link" onClick={toggleNotificationsModal} style={handleColor}>
                      <MDBIcon fas icon="bell" style={handleColor} /> Notification
                      {!student?.isNotificationsRead && student?.notifications?.length > 0 && (
                        <span className="badge bg-danger">
                          {student?.notifications.length}
                        </span>
                      )}
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink  className="navbar-link" onClick={toggleVideosModal} style={handleColor}>
                      <MDBIcon fas icon="video" style={handleColor} /> Recommended Videos
                      {!student?.isRecommenedVideosRead && student?.recommendedVideos?.length > 0 && (
                        <span className="badge bg-danger">
                          {student.recommendedVideos.length}
                        </span>
                      )}
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </>
              )}
            </MDBNavbarNav>
            <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
              <MDBNavbarItem className="active">
                <MDBNavbarLink aria-current="page"  className="navbar-link" onClick={handleLogout} style={handleColor}>
                  Logout
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

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
              <MDBModalTitle>Feedback</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleFeedbackModal}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {staff && staff?.feedback?.length > 0 ? (
                <Feedback feedback={staff.feedback} isStaff={true} />
              ) : (
                <MDBTypography note noteColor="danger">
                  <strong>Note:</strong> No feedbacks available
                </MDBTypography>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Navbar;
