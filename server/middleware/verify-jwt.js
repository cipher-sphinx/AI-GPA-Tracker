const jwt = require("jsonwebtoken");

function verifyJwt(req, res, next) {
    const token = req.cookies.token;
  
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });
  
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY)
      req.user = {
        id: decoded.user.id,
        userType: decoded.user.userType,
      }
    } catch (error) {
      return res.status(401).json({"error": "Invalid Token"})        
    }
    next()
  }

module.exports = verifyJwt;
