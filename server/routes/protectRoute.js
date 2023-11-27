const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verify-jwt');

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully." });
});

// Apply the verifyJwt middleware to any routes that should be protected
router.get('/protectedRoute', verifyJwt, (req, res) => {
  // This route is protected by the verifyJwt middleware
  res.json({
    userType: req.user.userType,
    id: req.user.id
  });
});

module.exports = router;
