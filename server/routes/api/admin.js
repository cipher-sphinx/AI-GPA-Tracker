const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const verifyToken = require("../../middleware/verify-jwt");
const Student = require("../../models/Student");
const Staff = require("../../models/Staff");
const Subject = require("../../models/Subject");
const Admin = require("../../models/Admin");

// @route GET api/admin/students/:id/attendance
// @desc Get attendance of a student
// @access Private (will require a JWT token)
router.get("/students/:id/attendance", verifyToken, (req, res) => {
  Student.findById(req.params.id)
    .then((student) => res.json(student.attendance))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/admin/students
// @desc Add a new student
// @access Private (will require a JWT token)
router.post("/students", verifyToken, async (req, res) => {
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
  try {
    const validUsername = username ? username : firstName;

    // Check for existing student
    const student = await Student.findOne({ email });

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

    const savedStudent = await newStudent.save();

    // Update the subject object with the subjectId
    let updatedSubject = await Subject.findOneAndUpdate(
      { _id: subjectId },
      { $push: { studentIds: savedStudent._id } },
      { new: true }
    );
    if (!updatedSubject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    res.json(savedStudent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// @route PUT api/admin/students/:id
// @desc Update a student
// @access Private (will require a JWT token)
router.put("/students/:id", verifyToken, (req, res) => {
  const { firstName, lastName, username, password, email, marks } = req.body;

  // Simple validation
  if (!firstName || !lastName || !username || !email || !marks) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  const updates = {
    firstName,
    lastName,
    username,
    email,
    marks,
  };

  if (password) {
    updates.password = password;
  }

  // Update the student
  Student.findByIdAndUpdate(req.params.id, updates)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route DELETE api/admin/students/:id
// @desc Delete a student
// @access Private (will require a JWT token)
router.delete("/students/:id", verifyToken, (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      if (!student) {
        res.status(404).json({ success: false, message: "Student not found" });
      } else {
        res.json({ success: true });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: `Error deleting student: ${err.message}`,
      });
    });
});

// @route GET api/admin/staff/:id/feedback
// @desc Get feedback count given by a staff member for each subject
// @access Private (will require a JWT token)
router.get("/staff/:id/feedback", verifyToken, (req, res) => {
  Student.aggregate([
    { $unwind: "$feedback" },
    {
      $match: {
        "feedback.staffId": new mongoose.Types.ObjectId(req.params.id),
      },
    },
    { $group: { _id: "$feedback.subjectId", count: { $sum: 1 } } },
  ])
    .then((results) => {
      const feedbackCountPerSubject = {};
      results.forEach((result) => {
        feedbackCountPerSubject[result._id.toString()] = result.count;
      });
      res.json(feedbackCountPerSubject);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// @route GET api/admin/staff/:id/feedback
// @desc Get feedback given by a staff member
// @access Private (will require a JWT token)
router.get("/staff/:id/feedback/v2", verifyToken, (req, res) => {
  Student.find({
    "feedback.staffId": new mongoose.Types.ObjectId(req.params.id),
  })
    .then((students) => {
      let feedbacks = [];
      students.forEach((student) => {
        student.feedback.forEach((feedback) => {
          if (feedback.staffId.toString() === req.params.id) {
            feedbacks.push(feedback);
          }
        });
      });
      feedbacks.sort((a, b) => b.date - a.date); // Sort feedbacks by date in descending order
      res.json(feedbacks);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/admin/staff/:id/feedback
// @desc Add feedback for a staff member
// @access Private (will require a JWT token)
router.post("/staff/:id/feedback", verifyToken, (req, res) => {
  const { message, adminId } = req.body;

  // Simple validation
  if (!message) {
    return res.status(400).json({ message: "Please enter a message." });
  }

  const newFeedback = {
    adminId,
    message,
    date: Date.now(),
  };

  Staff.findByIdAndUpdate(
    req.params.id,
    { $push: { feedback: newFeedback } },
    { new: true }
  )
    .then((student) => res.json(student))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/admin/staff
// @desc Add a new staff member
// @access Private (will require a JWT token)
router.post("/staff", verifyToken, (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  // Simple validation
  if (!firstName || !lastName || !username || !password || !email) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Check for existing staff
  Staff.findOne({ username }).then((staff) => {
    if (staff) return res.status(400).json({ message: "User already exists" });

    const newStaff = new Staff({
      firstName,
      lastName,
      username,
      password,
      email,
    });

    newStaff.save().then((staff) => {
      res.json({
        staff: {
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          username: staff.username,
          email: staff.email,
        },
      });
    });
  });
});

// @route PUT api/admin/staff/:id
// @desc Update a staff member
// @access Private (will require a JWT token)
router.put("/staff/:id", verifyToken, (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  // Simple validation
  if (!firstName || !lastName || !username || !email) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  const updates = {
    firstName,
    lastName,
    username,
    email,
  };

  if (password) {
    updates.password = password;
  }

  Staff.findByIdAndUpdate(req.params.id, updates)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route DELETE api/admin/staff/:id
// @desc Delete a staff member
// @access Private (will require a JWT token)
router.delete("/staff/:id", verifyToken, (req, res) => {
  Staff.findByIdAndDelete(req.params.id)
    .then((staff) => {
      if (!staff) {
        res.status(404).json({ success: false, message: "Staff not found" });
      } else {
        res.json({ success: true });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: `Error deleting staff: ${err.message}`,
      });
    });
});

// -------------- CRUD Operations for Subjects ---------------------------------

// @route POST api/admin/subjects
// @desc Add a new subject
// @access Private (will require a JWT token)
router.post("/subjects", verifyToken, async (req, res) => {
  const { name, staff } = req.body;

  // Simple validation
  if (!name || !staff) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    const newSubject = new Subject({
      name,
      staff,
      date: Date.now(),
    });

    const savedSubject = await newSubject.save();

    // Update the staff object with the subjectId
    // await Staff.updateOne({ _id: staff }, { subjectId: savedSubject._id });
    let updatedStaff = await Staff.findOneAndUpdate(
      { _id: staff },
      { subjectId: savedSubject._id },
      { new: true }
    );
    if (!updatedStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    res.json(savedSubject);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// @route GET api/admin/subjects
// @desc Get all subjects
// @access Private (will require a JWT token)
router.get("/subjects", (req, res) => {
  Subject.find()
    .sort({ date: -1 })
    .then((subjects) => res.json(subjects))
    .catch((err) => res.status(500).json({ success: false }));
});

// api/admin/subjects/:id
router.get("/subjects/:id", verifyToken, (req, res) => {
  Subject.findById(req.params.id)
    .then((subject) => res.json(subject))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route PUT api/admin/subjects/:id
// @desc Update a subject
// @access Private (will require a JWT token)
router.put("/subjects/:id", verifyToken, async (req, res) => {
  const { name, staff } = req.body;

  // Simple validation
  if (!name || !staff) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    // Update subject
    let subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, staff },
      { new: true }
    );
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    // Update staff
    let updatedStaff = await Staff.findOneAndUpdate(
      { _id: subject.staff },
      { subjectId: req.params.id },
      { new: true }
    );
    if (!updatedStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    // If everything went well, return success
    res.json({ success: true });
  } catch (err) {
    // Handle possible errors
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route DELETE api/admin/subjects/:id
// @desc Delete a subject
// @access Private (will require a JWT token)
router.delete("/subjects/:id", verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    // Update the staff object to remove the subjectId
    await Staff.findOneAndUpdate(
      { _id: subject.staff },
      { $unset: { subjectId: "" } },
      { new: true }
    );

    // Update the student object to remove the subjectId
    await Student.updateMany(
      { _id: { $in: subject.studentIds } },
      { $unset: { subjectId: "" } },
      { new: true }
    );

    // Remove the subject
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error deleting subject: ${err.message}`,
    });
  }
});

// @route PUT api/admin/:id
// @desc Update admin's profile
// @access Private (will require a JWT token)
router.put("/:id", verifyToken, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Check if the user exists
  const admin = await Admin.findOne({ _id: req.params.id });

  if (!admin) {
    return res.status(404).json({ message: "User not found." });
  }

  let update = {
    email,
    firstName,
    lastName,
  };

  if (password) {
    update.password = password;
  }

  Admin.findOneAndUpdate({ _id: req.params.id }, update, { new: true })
    .then(() => res.json({ success: true }))
    .catch((err) =>
      res.status(404).json({ success: false, error: err.message })
    );
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    // Attempt to find the admin member
    const admin = await Admin.findById(req.params.id);

    // If no admin was found, respond with 404
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Student member not found",
      });
    }

    // Staff member was found, respond with it
    return res.json(admin);
  } catch (err) {
    // Log the error for debugging and respond with 500
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
