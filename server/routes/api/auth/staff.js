const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../../../models/Staff");

// @route POST api/auth/staff/register
// @desc Register new staff
// @access Public
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Check for existing staff
  Staff.findOne({ email }).then((staff) => {
    if (staff)
      return res.status(400).json({ message: "Staff already exists." });

    const newStaff = new Staff({
      firstName,
      lastName,
      email,
      password,
    });


    newStaff.save().then((staff) => {
      jwt.sign(
        {
          user: {
            id: staff.id,
            userType: 'staff'
          },
        },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // use secure cookies in production
            sameSite: 'lax',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000) // cookie will be removed after 2 hours
          });
          res.json({
            staff: {
              id: staff.id,
              firstName: staff.firstName,
              lastName: staff.lastName,
              email: staff.email,
            },
          });
        }
      );
    });
  });
});

// @route POST api/auth/staff/login
// @desc Login a staff and return JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Find staff by email
  const staff = await Staff.findOne({ email });

  if (!staff) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, staff.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Sign JWT
  const payload = {
    user: {
      id: staff._id,
      userType: 'staff'
    },
  };

  jwt.sign(
    payload,
    process.env.TOKEN_KEY,
    { expiresIn: "2h" },
    (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // use secure cookies in production
        sameSite: 'lax',
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000) // cookie will be removed after 2 hours
      });
      res.json({
        staff: {
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
        },
      });
    }
  );
});

module.exports = router;
