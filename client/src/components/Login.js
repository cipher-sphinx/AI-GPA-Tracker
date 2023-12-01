import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, alertData } from "../utils/validators";

const initialLoginState = { email: "", password: "" };

const initalRegisterState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  semester1: "",
  semester2: "",
  subjectId: "",
};

function Login() {
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [alert, setAlert] = useState({ show: false, messages: [] });
  const [subjects, setSubjects] = useState([]);
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

  const fetchAllSubjects = async () => {
    try {
      const response = await axios.get(
        "/api/admin/subjects"
      );
      setSubjects(response.data);
    } catch (error) {
      showError(error.response.data.message || error.response.data.msg);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  const handleLogin = async () => {
    let errorMessages = [];

    errorMessages = errorMessages.concat(validateEmail(loginData.email));
    errorMessages = errorMessages.concat(validatePassword(loginData.password));

    if (errorMessages.length > 0) {
      showError(errorMessages);
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/student/login",
        loginData
      );

      const { student } = response.data;
      const data = {
        userId: student.id,
      };

      localStorage.setItem("userData", JSON.stringify(data));

      navigate(`/dashboard/${student.id}`, { state: { userType: "student" } });
      setLoginData(initialLoginState);
    } catch (error) {
      showError(error.response.data.message || error.response.data.msg);
    }
  };

  const handleRegister = async () => {
    const { firstName, lastName, username, semester1, semester2, subjectId } = registerData;

    // Check if any of the fields are empty
    if (!firstName || !lastName || !username || !semester1 || !semester2 || !subjectId || subjectId === "no-subject") {
      showError(['Please Enter All Fields.']);
      return;
    }

    let errorMessages = [];

    errorMessages = errorMessages.concat(validateEmail(registerData.email));
    errorMessages = errorMessages.concat(validatePassword(registerData.password));

    if (errorMessages.length > 0) {
      showError(errorMessages);
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/student/register",
        registerData
      );
      const { student } = response.data;
      const data = {
        userId: student.id,
      };
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(`/dashboard/${student.id}`, { state: { userType: "student" } });
      setRegisterData(initalRegisterState);
    } catch (error) {
      showError([error.response.data.message || error.response.data.msg]);
    }
  };

  const hideErrors = () => {
    setAlert({ show: false, messages: [] });
  };

  const showError = (messages) => {
    setAlert({ show: true, messages: Array.isArray(messages) ? messages : [messages] });
  };

  return (
    <>
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50 login-container">
        <div className="d-flex justify-content-center mb-4">
          <img src="https://cdn.icon-icons.com/icons2/1846/PNG/512/student3_116217.png" alt="Logo" style={{ width: '150px' }} />
        </div>

        <div className="text-center mb-3">
          <h2>Welcome to the Student Panel</h2>
          <p>Please sign in to continue</p>
        </div>
        {/* <div className="d-flex align-items-center justify-content-center">
          <MDBBtn className="w-30 mb-4" href="/staff/login">
            Staff Login
          </MDBBtn>
        </div> */}

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
              <p><b>Student Sign In</b></p>
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

            <MDBBtn className="mb-4 w-100" onClick={handleLogin} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}>
              Sign in
            </MDBBtn>

            {alertData(alert,hideErrors)}

          </MDBTabsPane>

          <MDBTabsPane show={justifyActive === "tab2"}>
            <div className="text-center mb-3">
              <p><b>Student Sign Up</b></p>
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
              label="Username"
              id="form1"
              type="text"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
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
            <p className="fw-bolder">Previous Years Averages</p>
            <MDBInput
              wrapperClass="mb-4"
              label="First Year Average"
              id="form1"
              type="number"
              value={registerData.semester1}
              onChange={(e) =>
                setRegisterData({ ...registerData, semester1: e.target.value })
              }
            />

            <MDBInput
              wrapperClass="mb-4"
              label="Second Year Average"
              id="form1"
              type="number"
              value={registerData.semester2}
              onChange={(e) =>
                setRegisterData({ ...registerData, semester2: e.target.value })
              }
            />

            <select
              className="form-select mb-4"
              value={registerData.subjectId}
              onChange={(e) =>
                setRegisterData({ ...registerData, subjectId: e.target.value })
              }
            >
              <option value="no-subject" >Select a degree program</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <MDBBtn
              className="mb-4 w-100"
              style={{ backgroundColor: '#FF5733', borderColor: '#FF5733' }}
              onClick={handleRegister}
              disabled={
                registerData.subjectId === "no-subject" ||
                !registerData.subjectId
              }
            >
              Sign up
            </MDBBtn>

            {alertData(alert,hideErrors)}
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
}

export default Login;
