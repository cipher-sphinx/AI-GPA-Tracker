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

const EventsModal = ({
  showEventsModal,
  setShowEventsModal,
  fetchStaffData,
  students,
  fetchAllStudents,
}) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventMessage, setNewEventMessage] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState("");

  const handleEventNoteChange = (event) => {
    setNewEventMessage(event.target.value);
  };

  const handleNewEventChange = (event) => {
    setNewEvent(event.target.value);
  };

  const handleNewEventSubmit = async () => {
    try {
      await axios.post(
        "/api/staff/events",
        { eventDescription: newEvent },
      );
      setNewEvent("");
      setIsAddingEvent(false);
      fetchStaffData();
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSaveEvent = async (id) => {
    try {
      await axios.put(
        `/api/staff/events/${id}`,
        { eventDescription: newEventMessage },
      );
      setNewEventMessage("");
      setEditingEvent(null);
      fetchStaffData();
      fetchAllStudents();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleCancelNewEvent = () => {
    setNewEventMessage("");
    setIsAddingEvent(false);
  };

  const renderNewEventSection = () => {
    if (isAddingEvent) {
      return (
        <>
          <MDBInput
            type="textarea"
            label="Your event"
            rows="3"
            value={newEvent}
            onChange={handleNewEventChange}
          />
          <MDBBtn color="primary" onClick={handleNewEventSubmit}>
            Add Event
          </MDBBtn>
          <MDBBtn color="secondary" onClick={handleCancelNewEvent}>
            Cancel
          </MDBBtn>
        </>
      );
    } else {
      return (
        <MDBBtn color="primary" onClick={() => setIsAddingEvent(true)}>
          <MDBIcon fas icon="plus" /> Add new event
        </MDBBtn>
      );
    }
  };

  return (
    <MDBModal
      className="modal-open"
      show={showEventsModal}
      setShow={setShowEventsModal}
      staticBackdrop={true}
      keyboard={false}
      tabIndex="-1"
    >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Event</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setShowEventsModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {renderNewEventSection()}
            <MDBContainer className="mt-3">
              <MDBRow>
                <MDBListGroup style={{ minWidth: "22rem" }} light>
                  {students[0]?.notifications?.length > 0 &&
                    students[0]?.notifications.map((notification) =>
                      editingEvent === notification._id ? (
                        <div key={notification._id}>
                          <MDBInput
                            type="textarea"
                            label="Your event"
                            rows="3"
                            value={newEventMessage}
                            onChange={handleEventNoteChange}
                          />
                          <MDBBtn
                            color="primary"
                            onClick={() => handleSaveEvent(notification._id)}
                          >
                            Save
                          </MDBBtn>
                          <MDBBtn
                            color="secondary"
                            onClick={() => setEditingEvent(null)}
                          >
                            Cancel
                          </MDBBtn>
                        </div>
                      ) : (
                        <MDBListGroupItem
                          key={notification._id}
                          noBorders
                          color="dark"
                          className="px-3 rounded-3 mb-2 d-flex justify-content-between"
                        >
                          {notification.message}
                          <MDBIcon
                            fas
                            icon="pen"
                            style={{ color: "white" }}
                            onClick={() => {
                              setEditingEvent(notification._id);
                              setNewEventMessage(notification.message);
                            }}
                          />
                        </MDBListGroupItem>
                      )
                    )}
                </MDBListGroup>
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EventsModal;
