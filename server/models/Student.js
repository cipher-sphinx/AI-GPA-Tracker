const { model, Schema } = require("mongoose");
const hashPassword = require("../helpers/hashPassword");

const StudentSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  subjectId: Schema.Types.ObjectId,
  marks: {
    semester1: Number,
    semester2: Number,
    semester3: Number,
    average: Number
  },
  averageMarksHistory: [
    {
      average: Number,
      semester1: Number,
      semester2: Number,
      semester3: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  predict: {
    studentAge: Number,
    studyTime: Number,
    absent: String,
    healthStatus: String,
    financialStatus: String,
    alcoholConsumption: String,
    studentGender: String,
    studyMode: String,
    repeated: String,
    extraSupport: String,
    firstYearAverage: Number,
    secondYearAverage: Number,
    thirdYearAverage: Number,
  },
  averagePredictHistory: [
    {
      studentAge: Number,
      studyTime: Number,
      absent: String,
      healthStatus: String,
      financialStatus: String,
      alcoholConsumption: String,
      studentGender: String,
      studyMode: String,
      repeated: String,
      extraSupport: String,
      firstYearAverage: Number,
      secondYearAverage: Number,
      thirdYearAverage: Number,
      date: { type: Date, default: Date.now },
    }
  ],
  feedback: [
    {
      staffId: Schema.Types.ObjectId,
      subjectId: Schema.Types.ObjectId,
      message: String,
      date: Date,
    },
  ],
  attendance: [Date],
  notifications: [
    {
      _id: Schema.Types.ObjectId,
      message: String
    }
  ],
  isNotificationsRead: Boolean,
  isRecommenedVideosRead: Boolean,
  recommendedVideos: [String],
});

// Hashing password before storing to the database
StudentSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await hashPassword(this.password);
  }

  next();
});

StudentSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = this.getUpdate();
  if (docToUpdate.password) {
    docToUpdate.password = await hashPassword(docToUpdate.password);
  }
  next();
});

module.exports = model("Student", StudentSchema);
