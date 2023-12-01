import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBInput,
  MDBIcon,
  MDBContainer,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import axios from "axios";

const VideosModal = ({
  showVideosModal,
  setShowVideosModal,
  fetchStaffData,
  students,
  fetchAllStudents,
}) => {
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoLink, setNewVideoLink] = useState("");

  const handleVideoLinkChange = (event) => {
    setNewVideoLink(event.target.value);
  };

  const handleNewVideoSubmit = async () => {
    try {
      await axios.post(
        "/api/staff/videos",
        { videoLink: newVideoLink }
      );
      setNewVideoLink("");
      setIsAddingVideo(false);
      fetchStaffData();
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleCancelNewVideo = () => {
    setNewVideoLink("");
    setIsAddingVideo(false);
  };

  const renderNewVideoSection = () => {
    if (isAddingVideo) {
      return (
        <>
          <MDBInput
            type="text"
            label="Your video link"
            value={newVideoLink}
            onChange={handleVideoLinkChange}
          />
          <MDBBtn color="primary" onClick={handleNewVideoSubmit}>
            Add Video
          </MDBBtn>
          <MDBBtn color="secondary" onClick={handleCancelNewVideo}>
            Cancel
          </MDBBtn>
        </>
      );
    } else {
      return (
        <MDBBtn color="primary" onClick={() => setIsAddingVideo(true)}>
          <MDBIcon fas icon="plus" /> Add new video
        </MDBBtn>
      );
    }
  };

  return (
    <MDBModal
      className="modal-open"
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
              onClick={() => setShowVideosModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {renderNewVideoSection()}
            <MDBContainer className="mt-3">
              <MDBRow>
                <MDBListGroup style={{ minWidth: "22rem" }} light>
                  {students[0]?.recommendedVideos?.length > 0 &&
                    students[0]?.recommendedVideos.map((videoLink, index) => (
                      <MDBListGroupItem
                        key={index}
                        noBorders
                        color="dark"
                        className="px-3 rounded-3 mb-2"
                      >
                        {videoLink}
                      </MDBListGroupItem>
                    ))}
                </MDBListGroup>
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default VideosModal;
