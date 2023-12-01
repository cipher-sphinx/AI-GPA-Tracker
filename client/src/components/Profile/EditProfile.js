import React, { useState } from "react";
import {
  MDBTypography,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  // MDBCardTitle,
  MDBCardText,
} from "mdb-react-ui-kit";
import { Person, Email, Lock, School } from '@mui/icons-material';
import axios from "axios";

const EditProfile = ({ user, toggleEdit, getUser, userType, avatarUrl }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [semester1Mark, setSemester1Mark] = useState(user.marks?.semester1);
  const [semester2Mark, setSemester2Mark] = useState(user.marks?.semester2);

  const updateUser = async ({
    firstName,
    lastName,
    email,
    password,
    semester1Mark,
    semester2Mark,
  }) => {
    let marksChanged =
      semester1Mark !== user.marks?.semester1 ||
      semester2Mark !== user.marks?.semester2;

    try {
      const editUserDetails = {
        firstName,
        lastName,
        email,
        password,
        ...(userType === "student" && marksChanged && {
          semester1: semester1Mark,
          semester2: semester2Mark,
        }),
      };

      await axios.put(`/api/${userType}/${user._id}`, editUserDetails);

      toggleEdit();
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    updateUser({
      firstName,
      lastName,
      email,
      password,
      semester1Mark: semester1Mark !== user.marks?.semester1 ? semester1Mark : undefined,
      semester2Mark: semester2Mark !== user.marks?.semester2 ? semester2Mark : undefined,
    });
  };

  return (
    <MDBCard className="shadow profile-card" style={{ width: "22rem", marginTop: "1rem" }}>
      <MDBCardBody>
        <div className="profile-pic-container">
          <img style={{ height: "70px", margin: "2rem auto auto 4rem" }} src={avatarUrl} className="rounded-circle" alt="profile" />
          <MDBTypography style={{margin: "3rem 2rem auto auto"}} variant="h4">Edit Profile</MDBTypography>
        </div>
        <MDBCardText>
          <div className="input-field">
            <Person className="input-icon" />
            <MDBInput
              label="First Name"
              id="form1"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <Person className="input-icon" />
            <MDBInput
              label="Last Name"
              id="form2"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <Email className="input-icon" />
            <MDBInput
              label="Email"
              id="form3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field">
            <Lock className="input-icon" />
            <MDBInput
              label="Password"
              id="form4"
              a
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {userType === "student" && (
            <>
              <div className="input-field">
                <School className="input-icon" />
                <MDBInput
                  label="First Year Average"
                  id="form5"
                  type="number"
                  value={semester1Mark}
                  onChange={(e) => setSemester1Mark(e.target.value)}
                />
              </div>
              <div className="input-field">
                <School className="input-icon" />
                <MDBInput
                  label="Second Year Average"
                  id="form6"
                  type="number"
                  value={semester2Mark}
                  onChange={(e) => setSemester2Mark(e.target.value)}
                />
              </div>
            </>
          )}
          <MDBBtn
            className="save-changes-btn"
            onClick={handleSave}
            style={{ marginTop: "1rem" }}
          >
            Save Changes
          </MDBBtn>
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
};

export default EditProfile;
