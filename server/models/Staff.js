const { Schema, model } = require("mongoose");
const hashPassword = require("../helpers/hashPassword");

const StaffSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  notes: [
    {
      message: String,
      date: Date,
    },
  ],
  feedback: [
    {
      adminId: Schema.Types.ObjectId,
      message: String,
      date: Date,
    },
  ],
  subjectId: Schema.Types.ObjectId,
});

StaffSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await hashPassword(this.password);
  }

  next();
});

StaffSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = this.getUpdate();
  if (docToUpdate.password) {
    docToUpdate.password = await hashPassword(docToUpdate.password);
  }
  next();
});

module.exports = model("Staff", StaffSchema);
