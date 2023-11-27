const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../../middleware/verify-jwt");
const Student = require("../../../models/Student");
const Subject = require("../../../models/Subject");

// @route POST api/auth/student/register
// @desc Register new student
// @access Public
router.post("/register", async (req, res) => {
  // 1st and 2nd Semester marks are entered when creating the student
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    semester1,
    semester2,
    subjectId,
  } = req.body;

  // Simple validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !semester1 ||
    !semester2 ||
    !subjectId
  ) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  const validUsername = username ? username : firstName;

  // Check for existing student
  Student.findOne({ email }).then((student) => {
    if (student)
      return res.status(400).json({ message: "Student already exists." });

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      username: validUsername,
      password,
      marks: {
        semester1,
        semester2,
      },
      subjectId,
    });

    newStudent.save().then(async (student) => {

      // Update the subject object with the subjectId
      let updatedSubject = await Subject.findOneAndUpdate(
        { _id: subjectId },
        { $push: { studentIds: student.id } },
        { new: true }
      );
      if (!updatedSubject) {
        return res
          .status(404)
          .json({ success: false, message: "Subject not found" });
      }

      // Sign JWT
      const payload = {
        user: {
          id: student.id,
          userType: 'student'
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
            student: {
              id: student.id,
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
              marks: student.marks,
            },
          });
        }
      );
    });
  });
});

// @route POST api/auth/student/login
// @desc Login a student and return JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Find student by email
  const student = await Student.findOne({ email });

  if (!student) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // Validate password
  const isMatch = await bcrypt.compareSync(password, student.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  // Sign JWT
  const payload = {
    user: {
      id: student._id,
      userType: 'student'
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
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          marks: student.marks,
        },
      });
    }
  );
});

router.get("/welcome", verifyToken, (req, res) => {
  res.status(200).json({ Sucess: "Welcome to the home page" });
});

module.exports = router;
