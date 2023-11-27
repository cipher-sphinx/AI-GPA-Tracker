const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../../models/Admin");

// @route POST api/auth/admin/register
// @desc Register new admin
// @access Public
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Check for existing admin
  Admin.findOne({ email }).then((admin) => {
    if (admin)
      return res.status(400).json({ message: "Admin already exists." });

    const newStudent = new Admin({
      firstName,
      lastName,
      email,
      password,
    });

    newStudent.save().then((admin) => {
      jwt.sign(
        {
          user: {
            id: admin.id,
            userType: 'admin'
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
            admin: {
              id: admin.id,
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email,
            },
          });
        }
      );
    });
  });
});

// @route POST api/auth/admin/login
// @desc Login a admin and return JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Find admin by email
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Sign JWT
  const payload = {
    user: {
      id: admin._id,
      userType: 'admin'
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
        admin: {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
        },
      });
    }
  );
});

module.exports = router;
