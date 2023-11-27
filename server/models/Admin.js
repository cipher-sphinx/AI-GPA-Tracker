const mongoose = require("mongoose");
const hashPassword = require("../helpers/hashPassword");

const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await hashPassword(this.password);
  }

  next();
});

module.exports = mongoose.model("Admin", AdminSchema);
