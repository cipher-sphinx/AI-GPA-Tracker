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
  MDBCol,
} from "mdb-react-ui-kit";
import axios from "axios";
import NoteCard from "./NoteCard";

const NotesModal = ({ showNotesModal, setShowNotesModal, fetchStaffData, staff }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteMessage, setNewNoteMessage] = useState('');

  const handleNewNoteChange = (event) => {
    setNewNoteMessage(event.target.value);
  };

  const handleNewNoteSubmit = async () => {
    try {
      await axios.post(
        "/api/staff/notes",
        { message: newNoteMessage },
      );
      setNewNoteMessage('');
      setIsAddingNote(false);
      fetchStaffData();
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteMessage('');
    setIsAddingNote(false);
  };

  const renderNewNoteSection = () => {
    if (isAddingNote) {
      return (
        <>
          <MDBInput type="textarea" label="Your note" rows="3" value={newNoteMessage} onChange={handleNewNoteChange}/>
          <MDBBtn color="primary" onClick={handleNewNoteSubmit}>Add Note</MDBBtn>
          <MDBBtn color="secondary" onClick={handleCancelNewNote}>Cancel</MDBBtn>
        </>
      );
    } else {
      return (
        <MDBBtn color="primary" onClick={() => setIsAddingNote(true)}>
          <MDBIcon fas icon="plus" /> Add new note
        </MDBBtn>
      );
    }
  };

  return (
    <MDBModal
      show={showNotesModal}
      setShow={setShowNotesModal}
      tabIndex="-1"
      staticBackdrop={true}
      keyboard={false}
    >
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Notes</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setShowNotesModal(false)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {renderNewNoteSection()}
            <MDBContainer className="mt-3">
              <MDBRow>
                {staff?.notes?.map((note, index) => (
                  <MDBCol key={index} style={{ marginBottom: '1rem' }}>
                    <NoteCard note={note} />
                  </MDBCol>
                ))}
              </MDBRow>
            </MDBContainer>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default NotesModal;
