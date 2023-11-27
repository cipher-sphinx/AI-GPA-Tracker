const { model, Schema } = require("mongoose");

const subjectsSchema = new Schema({
  name: String,
  staff: Schema.Types.ObjectId,
  studentIds: [Schema.Types.ObjectId],
  date: Date,
});

module.exports = model("Subject", subjectsSchema);
