import React, { useState } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  alertData,
} from "../utils/validators";

const initialLoginState = { email: "", password: "" };

const initalRegisterState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function AdminLogin() {
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [loginData, setLoginData] = useState(initialLoginState);
  const [registerData, setRegisterData] = useState(initalRegisterState);

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setLoginData(initialLoginState);
    setRegisterData(initalRegisterState);
    hideErrors();

    setJustifyActive(value);
  };

  const handleLogin = async () => {
    let errorMessages = [];

    errorMessages = errorMessages.concat(validateEmail(loginData.email));
    errorMessages = errorMessages.concat(validatePassword(loginData.password));

    if (errorMessages.length > 0) {
      showError(errorMessages);
      return;
    }

    try {
      const response = await axios.post("/api/auth/admin/login", loginData);
      const { admin } = response.data;
      const data = {
        userId: admin.id,
      };
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(`/dashboard/admin/${admin.id}`, {
        state: { userType: "admin" },
      });
      setLoginData(initialLoginState);
    } catch (error) {
      showError(error.response.data.message || error.response.data.msg);
    }
  };

  const handleRegister = async () => {
    const { firstName, lastName } = registerData;

    // Check if any of the fields are empty
    if (!firstName || !lastName) {
      showError(["Please Enter All Fields."]);
      return;
    }

    let errorMessages = [];

    errorMessages = errorMessages.concat(validateEmail(registerData.email));
    errorMessages = errorMessages.concat(
      validatePassword(registerData.password)
    );

    if (errorMessages.length > 0) {
      showError(errorMessages);
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/admin/register",
        registerData
      );
      const { admin } = response.data;
      const data = {
        userId: admin.id,
      };
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(`/dashboard/admin/${admin.id}`, {
        state: { userType: "admin" },
      });
      setRegisterData(initalRegisterState);
    } catch (error) {
      showError(error.response.data.message || error.response.data.msg);
    }
  };

  const hideErrors = () => {
    setAlert({ show: false, messages: [] });
  };

  const showError = (messages) => {
    setAlert({
      show: true,
      messages: Array.isArray(messages) ? messages : [messages],
    });
  };

  return (
    <>
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50 login-container">
        <div className="d-flex justify-content-center mb-4">
          <img
            src="https://icon-library.com/images/icon-admin/icon-admin-18.jpg"
            alt="Logo"
            style={{ width: "150px" }}
          />
        </div>

        <div className="text-center mb-3">
          <h2>Welcome to the Admin Panel</h2>
          <p>Please sign in to continue</p>
        </div>
        <MDBTabs
          pills
          justify
          className="mb-3 d-flex flex-row justify-content-between summer-tabs"
        >
          <MDBTabsItem className="tabs-item">
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab1")}
              active={justifyActive === "tab1"}
              className="tabs-link"
            >
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem className="tabs-item">
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab2")}
              active={justifyActive === "tab2"}
              className="tabs-link"
            >
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={justifyActive === "tab1"}>
            <div className="text-center mb-3">
              <p>Admin Sign in</p>
            </div>

            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form1"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <div className="d-flex justify-content-between mx-4 mb-4">
              <MDBCheckbox
                name="flexCheck"
                value=""
                id="flexCheckDefault"
                label="Remember me"
              />
              <a href="!#">Forgot password?</a>
            </div>

            <MDBBtn className="mb-4 w-100 admin-btn" onClick={handleLogin}>
              Sign in
            </MDBBtn>

            {alertData(alert, hideErrors)}
          </MDBTabsPane>

          <MDBTabsPane show={justifyActive === "tab2"}>
            <div className="text-center mb-3">
              <p>Admin Sign up</p>
            </div>

            <MDBInput
              wrapperClass="mb-4"
              label="First Name"
              id="form1"
              type="text"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstName: e.target.value })
              }
            />

            <MDBInput
              wrapperClass="mb-4"
              label="Last Name"
              id="form1"
              type="text"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastName: e.target.value })
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Email"
              id="form1"
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form1"
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            <MDBBtn className="mb-4 w-100" onClick={handleRegister}>
              Sign up
            </MDBBtn>

            {alertData(alert, hideErrors)}
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
}

export default AdminLogin;
