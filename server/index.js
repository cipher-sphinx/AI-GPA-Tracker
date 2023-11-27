const connectDB = require("./db/connect");
const express = require("express");
const bodyParser = require("body-parser");
const studentAuth = require('./routes/api/auth/student');
const staffAuth = require('./routes/api/auth/staff');
const adminAuth = require('./routes/api/auth/admin');
const Student = require("./routes/api/students")
const Staff = require("./routes/api/staff")
const Admin = require("./routes/api/admin")
const ProtectedRoute = require("./routes/protectRoute")
var cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Authentication urls
app.use('/api/auth/student', studentAuth);
app.use('/api/auth/staff', staffAuth);
app.use('/api/auth/admin', adminAuth);

// Other urls
app.use('/api/student', Student);
app.use('/api/staff', Staff);
app.use('/api/admin', Admin);

app.use('/', ProtectedRoute);

const PORT = 2000 || process.env.PORT

const start = async () => {
  try {
    await connectDB(
      process.env.MONGO_URI
    )
      .then(() => console.log("Successfully connected to MongoDB..."))
      .catch((err) => console.error("Could not connect to MongoDB...", err));
    app.listen(PORT, () => console.log(`Server has started on PORT - ${PORT}`))
  } catch (error) {
    console.log(error);
  }
};

start();
