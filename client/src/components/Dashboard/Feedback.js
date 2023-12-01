import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import moment from "moment";

const Feedback = ({ feedback, isStaff }) => {
  const [staff, setStaff] = useState({});
  const [admin, setAdmin] = useState({});
  const [subject, setSubject] = useState({});

  useEffect(() => {
    const fetchStaff = async () => {
      const staffIds = feedback?.map((item) => item.staffId);
      const staffPromises = staffIds?.map((id) =>
        axios.get(`/api/staff/${id}`)
      );

      try {
        const staffResponses = await Promise.all(staffPromises);
        const staffData = staffResponses.reduce((acc, staff, index) => {
          acc[staffIds[index]] = staff.data;
          return acc;
        }, {});
        setStaff(staffData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAdmin = async () => {
      const adminIds = feedback?.map((item) => item.adminId);
      const adminPromises = adminIds?.map((id) =>
        axios.get(`/api/admin/${id}`)
      );

      try {
        const adminResponses = await Promise.all(adminPromises);
        const adminData = adminResponses.reduce((acc, admin, index) => {
          acc[adminIds[index]] = admin.data;
          return acc;
        }, {});
        setAdmin(adminData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubject = async () => {
      const subjectIds = feedback?.map((item) => item.subjectId);
      const subjectPromises = subjectIds?.map((id) =>
        axios.get(`/api/admin/subjects/${id}`)
      );

      try {
        const SubjectResponses = await Promise.all(subjectPromises);
        const subjectData = SubjectResponses.reduce((acc, subject, index) => {
          acc[subjectIds[index]] = subject.data;
          return acc;
        }, {});
        setSubject(subjectData);
      } catch (error) {
        console.error(error);
      }
    };

    if (isStaff) {
      fetchAdmin();
    } else {
      fetchSubject();
      fetchStaff();
    }
  }, [feedback]);

  return (
    <div>
      <MDBListGroup>
        {feedback?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) =>
          isStaff
            ? admin[item.adminId] && (
              <MDBListGroupItem className="average-modal-item" key={item._id}>
                <MDBTypography variant="h6">
                  Admin: {admin[item.adminId]?.firstName}
                </MDBTypography>
                <MDBTypography variant="h6">
                  Message: {item.message}
                </MDBTypography>
                <MDBTypography variant="h6">
                  Date: {moment(item.date).format("MMM D YYYY, h:mm a")}
                </MDBTypography>
              </MDBListGroupItem>
            )
            : staff[item.staffId] &&
            subject[item.subjectId] && (
              <MDBListGroupItem className="average-modal-item" key={item._id}>
                <MDBTypography variant="h6">
                  Staff: {staff[item.staffId]?.firstName}
                </MDBTypography>
                <MDBTypography variant="h6">
                  Message: {item.message}
                </MDBTypography>
                <MDBTypography variant="h6">
                  Subject: {subject[item.subjectId]?.name}
                </MDBTypography>
                <MDBTypography variant="h6">
                  Date: {moment(item.date).format("MMM D YYYY, h:mm a")}
                </MDBTypography>
              </MDBListGroupItem>
            )
        )}
      </MDBListGroup>
    </div>

  );
};

export default Feedback;
