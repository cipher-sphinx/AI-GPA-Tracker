const express = require("express");
const router = express.Router();
const { exec } = require('child_process');
const verifyToken = require("../../middleware/verify-jwt");
const Student = require("../../models/Student");
const Subject = require("../../models/Subject");

// @route PUT api/students/:id/marks
// @desc Enter 3rd semester marks and calculate average
// @access Private (will require a JWT token)
router.put("/:id/marks", verifyToken, (req, res) => {
  const { semester3 } = req.body;

  // Simple validation
  if (!semester3) {
    return res
      .status(400)
      .json({ message: "Please enter 3rd semester marks." });
  }

  Student.findById(req.params.id)
    .then((student) => {
      const average =
        (Number(student.marks.semester1) +
          Number(student.marks.semester2) +
          Number(semester3)) /
        3;

      Student.findByIdAndUpdate(
        req.params.id,
        {
          "marks.semester3": semester3,
          "marks.average": average,
          $push: {
            averageMarksHistory: {
              average: average,
              semester1: student.marks.semester1,
              semester2: student.marks.semester2,
              semester3: semester3,
            },
          },
        },
        { new: true } // to return updated document
      )
        .then((updatedStudent) =>
          res.json({ success: true, student: updatedStudent })
        )
        .catch((err) => res.status(404).json({ success: false }));
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// @route GET api/students/:id/marks
// @desc Get history of student's marks
// @access Private (will require a JWT token)
router.get("/:id/marks", verifyToken, (req, res) => {
  Student.findById(req.params.id)
    .then((student) => res.json(student.marks))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route PUT api/students/:id
// @desc Update student's profile
// @access Private (will require a JWT token)
router.put("/:id", verifyToken, async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    semester1,
    semester2,
    semester3,
    subjectId,
  } = req.body;

  // Simple validation
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  const student = await Student.findById(req.params.id);

  // Initialize marks and average with previous values
  let marks = {
    semester1: student.marks.semester1,
    semester2: student.marks.semester2,
    semester3: student.marks.semester3,
    average: student.marks.average,
  };

  // If new marks provided, update them
  if (semester1) marks.semester1 = semester1;
  if (semester2) marks.semester2 = semester2;
  if (semester3) marks.semester3 = semester3;

  // Calculate average only if all three semesters exist
  if (marks.semester1 && marks.semester2 && marks.semester3) {
    marks.average =
      (Number(marks.semester1) +
        Number(marks.semester2) +
        Number(marks.semester3)) /
      3;
  }

  // Update fields
  let update = {
    email,
    firstName,
    lastName,
    ...(password && { password }),
    ...(subjectId && { subjectId }),
    "marks.semester1": marks.semester1,
    "marks.semester2": marks.semester2,
    "marks.average": marks.average,
  };

  if (marks.semester3) update["marks.semester3"] = marks.semester3;

  // Check if all semesters exist to push averageMarksHistory
  if (marks.semester1 && marks.semester2 && marks.semester3) {
    update.$push = {
      averageMarksHistory: {
        average: marks.average,
        date: new Date(),
        semester1: marks.semester1,
        semester2: marks.semester2,
        semester3: marks.semester3,
      },
    };
  }

  try {
    let student = await Student.findOneAndUpdate({ _id: req.params.id }, update, {
      new: true,
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Update subject
    await Subject.findOneAndUpdate(
      { _id: subjectId },
      { $push: { studentIds: req.params.id } },
      { new: true }
    );

    // If everything went well, return success
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Error deleting subject: ${err.message}`,
    });
  }
});

// @route GET api/student/:id
// @desc Get a student's details
// @access Private (will require a JWT token)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // Attempt to find the student member
    const student = await Student.findById(req.params.id);

    // If no student was found, respond with 404
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student member not found",
      });
    }

    // Staff member was found, respond with it
    return res.json(student);
  } catch (err) {
    // Log the error for debugging and respond with 500
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route GET api/students/:id/averageMarksHistory
// @desc Get history of student's average marks
// @access Private (will require a JWT token)
router.get("/:id/averageMarksHistory", verifyToken, (req, res) => {
  Student.findById(req.params.id)
    .then((student) => res.json(student.averageMarksHistory))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/", verifyToken, (req, res) => {
  Student.find()
    .then((students) => res.json(students))
    .catch((err) => res.status(500).json({ success: false }));
});

router.put("/markNotification/:id", verifyToken, (req, res) => {
  Student.findOneAndUpdate(
    { _id: req.params.id },
    { isNotificationsRead: true },
    { new: true }
  )
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

router.put("/markRecommendedVideo/:id", verifyToken, (req, res) => {
  Student.findOneAndUpdate(
    { _id: req.params.id },
    { isRecommenedVideosRead: true },
    { new: true }
  )
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(404).json({ success: false }));
});

// Define prediction function using your trained model
function predict(input) {
  const modelPath = '../server/routes/api/predict/stacking_model.pkl'; //  path to pickle model file
  const scriptPath = '../server/routes/api/predict/predict.py'; //  path to predict.py file
  // const modelPath = 'E:/FDP/stacking_model(old).pkl';
  // const pythonPath = 'C:\\Program Files\\Python312\\python.exe';

  return new Promise((resolve, reject) => {
    const command = `python ${scriptPath} ${modelPath} ${input.absent} ${input.healthStatus} ${input.financialStatus} ${input.alcoholConsumption} ${input.studentGender} ${input.studyMode} ${input.repeated} ${input.extraSupport} ${input.studentAge} ${input.studyTime} ${input.firstYearAverage} ${input.secondYearAverage}`;

    console.log("Command to execute:", command);  // Print out the constructed command

    exec(command, (error, stdout, stderr) => {
      if (error) {
          reject(error);
      } else {
          const prediction = stdout.trim(); // Get the predicted value from the output
          resolve(prediction);
      }
    });
  });
}

// Define an API endpoint to handle predictions "/:id/predict"
router.post("/:id/predict", verifyToken, (req, res) => {
  const input = req.body.input; // Assuming the input is passed in the request body as JSON

  const prediction = predict(input);
  console.log(input);
  prediction
    .then((result) => {
      console.log('Predicted Third Year Average Marks : ', result); // Log the predicted output on the console
      // Update the student's details in the database with the predicted third-year average marks
      Student.findByIdAndUpdate(
        req.params.id,
        {
          "predict.studentAge" : input.studentAge,
          "predict.studyTime" : input.studyTime,
          "predict.absent" : input.absent,
          "predict.healthStatus" : input.healthStatus,
          "predict.financialStatus" : input.financialStatus,
          "predict.alcoholConsumption" : input.alcoholConsumption,
          "predict.studentGender" : input.studentGender,
          "predict.studyMode" : input.studyMode,
          "predict.repeated" : input.repeated,
          "predict.extraSupport" : input.extraSupport,
          "predict.firstYearAverage" : input.firstYearAverage,
          "predict.secondYearAverage" : input.secondYearAverage,
          "predict.thirdYearAverage" : result,
          $push: {
            averagePredictHistory: {
              studentAge : input.studentAge,
              studyTime : input.studyTime,
              absent : input.absent,
              healthStatus : input.healthStatus,
              financialStatus : input.financialStatus,
              alcoholConsumption : input.alcoholConsumption,
              studentGender : input.studentGender,
              studyMode : input.studyMode,
              repeated : input.repeated,
              extraSupport : input.extraSupport,
              firstYearAverage : input.firstYearAverage,
              secondYearAverage : input.secondYearAverage,
              thirdYearAverage : result,
            }
          }
        },
        { new: true } // to return updated document
      )
        .then((updatedStudent) =>
          res.json({success: true, student: updatedStudent})
        )
        .catch((err) => res.status(404).json({ success: false }));
    })
    .catch((error) => {
      console.error('Prediction error:', error); // Log the error on the console
      res.status(500).json({ error: 'An error occurred while making predictions in the server.' });
    });
});

module.exports = router;
