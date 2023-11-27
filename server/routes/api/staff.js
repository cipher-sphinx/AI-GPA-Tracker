const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verify-jwt");
const Student = require("../../models/Student");
const Staff = require("../../models/Staff");
const mongoose = require("mongoose");

// @route GET api/staff/students/average
// @desc Get average marks of all students
// @access Private (will require a JWT token)
router.get("/students/average", verifyToken, (req, res) => {
  Student.find()
    .then((students) => {
      const averages = students.map((student) => ({
        studentId: student._id,
        average: student.marks.average,
      }));
      res.json(averages);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/staff/students/:id/feedback
// @desc Provide feedback to a student
// @access Private (will require a JWT token)
router.post("/students/:id/feedback", verifyToken, (req, res) => {
  const { message, subjectId, staffId } = req.body;

  // Simple validation
  if (!message) {
    return res.status(400).json({ message: "Please enter all fields." });
  }


  const newFeedback = {
    staffId,
    message,
    subjectId,
    date: Date.now(),
  };

  if (subjectId) {
    newFeedback.subjectId = subjectId;
  }

  Student.findByIdAndUpdate(
    req.params.id,
    { $push: { feedback: newFeedback } },
    { new: true }
  )
    .then((student) => res.json(student))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/staff/notes
// @desc Add a note
// @access Private (will require a JWT token)
router.post("/notes", verifyToken, (req, res) => {
  const { message } = req.body;

  // Simple validation
  if (!message) {
    return res.status(400).json({ message: "Please enter a message." });
  }

  const newNote = {
    message,
    date: Date.now(),
  };

  Staff.findByIdAndUpdate(req.user.id, {
    $push: { notes: newNote },
  })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/staff/students/:id/attendance
// @desc Add a date to student's attendance
// @access Private (will require a JWT token)
router.post("/students/:id/attendance", verifyToken, (req, res) => {
  const newAttendance = new Date();

  Student.findByIdAndUpdate(req.params.id, {
    $push: { attendance: newAttendance },
  })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/staff/students/:id/videos
// @desc Add a recommended video to a student
// @access Private (will require a JWT token)
router.post("/students/:id/videos", verifyToken, (req, res) => {
  const { videoLink } = req.body;

  // Simple validation
  if (!videoLink) {
    return res.status(400).json({ message: "Please enter a video link." });
  }

  Student.findByIdAndUpdate(req.params.id, {
    $push: { recommendedVideos: videoLink },
  })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route PUT api/staff/:id
// @desc Update staff's profile
// @access Private (will require a JWT token)
router.put("/:id", verifyToken, async (req, res) => {
  const { firstName, lastName, email, password, subjectId } = req.body;

  // Simple validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  // Check if the user exists
  const staff = await Staff.findOne({ _id: req.params.id });

  if (!staff) {
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

  if (subjectId) {
    update.subjectId = subjectId;
  }

  Staff.findOneAndUpdate({ _id: req.params.id }, update, { new: true })
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:id", verifyToken, async(req, res) => {
  try {
    // Attempt to find the staff member
    const staff = await Staff.findById(req.params.id);

    // If no staff was found, respond with 404
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    // Staff member was found, respond with it
    return res.json(staff);
  } catch (err) {
    // Log the error for debugging and respond with 500
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route POST api/staff/events
// @desc Add a new event and notify all students
// @access Private (will require a JWT token)
router.post("/events", verifyToken, async (req, res) => {
  const { eventDescription } = req.body;

  // Simple validation
  if (!eventDescription) {
    return res
      .status(400)
      .json({ message: "Please enter an event description." });
  }

  try {
    const students = await Student.find();

    const notification = {
      _id: new mongoose.Types.ObjectId(),
      message: eventDescription,
    };

    const updatePromises = students.map((student) =>
      Student.findByIdAndUpdate(
        student._id,
        { $push: { notifications: notification }, isNotificationsRead: false },
        { new: true }
      ).exec()
    );

    await Promise.all(updatePromises);

    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

// @route PUT api/staff/events/:id
// @desc Update an event
// @access Private (will require a JWT token)
router.put("/events/:id", verifyToken, (req, res) => {
  const { eventDescription } = req.body;

  // Simple validation
  if (!eventDescription) {
    return res.status(400).json({ message: "Please enter event description." });
  }

  // Update the event description for all students
  Student.updateMany(
    { "notifications._id": req.params.id },
    { $set: { "notifications.$.message": eventDescription } }
  )
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route POST api/staff/videos
// @desc Add a new video link to all students
// @access Private (will require a JWT token)
router.post("/videos", verifyToken, async (req, res) => {
  const { videoLink } = req.body;

  // Simple validation
  if (!videoLink) {
    return res
      .status(400)
      .json({ message: "Please enter an event description." });
  }

  try {
    const students = await Student.find();

    const updatePromises = students.map((student) =>
      Student.findByIdAndUpdate(
        student._id,
        { $push: { recommendedVideos: videoLink }, isRecommenedVideosRead: false },
        { new: true }
      ).exec()
    );

    await Promise.all(updatePromises);

    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

router.get("/", verifyToken, (req, res) => {
  Staff.find()
    .then((staff) => res.json(staff))
    .catch((err) => res.status(500).json({ success: false }));
});

module.exports = router;
