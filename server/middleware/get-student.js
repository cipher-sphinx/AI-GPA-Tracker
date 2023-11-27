const Student = require("../models/Student");

function getStudent(req, res, next) {
  Student.findById(req.params.id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ success: false });
      }
      req.student = student;
      next();
    })
    .catch((err) => res.status(500).json({ success: false }));
}

module.exports = getStudent;
