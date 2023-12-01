import React from "react";
import { MDBCard, MDBCardBody, MDBTypography, MDBCardText } from "mdb-react-ui-kit";
import moment from "moment";

const NoteCard = ({ note }) => {
  return (
    <MDBCard style={{ maxWidth: "22rem" }}>
      <MDBCardBody>
        <MDBTypography blockquote className="mb-0">
          <p>
            {note.message}
          </p>
        </MDBTypography>
        <MDBCardText>
          <small className='text-muted'>{moment(note.date).format("MMM D YYYY, h:mm:ss a")}</small>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
};

export default NoteCard;
