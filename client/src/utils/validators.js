import React from 'react';
import validator from 'validator';
import { MDBIcon } from 'mdb-react-ui-kit';

export const validateEmail = (email) => {
  let errors = [];
  if (!email || email.trim() === '') {
    errors.push('Email field cannot be empty.');
    return errors;
  }
  if (!validator.isEmail(email)) {
    errors.push('Email should include "@" and a domain.');
  }
  return errors;
};

export const validatePassword = (password) => {
  let errors = [];
  if (!password || password.trim() === '') {
    errors.push('Password field cannot be empty.');
    return errors;
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password should contain at least one special character.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password should contain at least one number.');
  }
  if (password.length < 8) {
    errors.push('Password should be at least 8 characters long.');
  }
  return errors;
};

export const alertData = (alert, hideErrors) => {
  if (alert.show && alert.messages && alert.messages.length > 0) {
    return (
      <div className="alert alert-danger" role="alert">
        <MDBIcon style={{ float: "right", cursor: "pointer" }} onClick={hideErrors} fas icon="times" />
        <ul>
          {alert.messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }
};