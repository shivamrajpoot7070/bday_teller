import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },

  class: { type: String, required: true },
  className: { type: String },
  section: { type: String, default: "" },

  // 🔥 NEW
  dobDay: { type: Number, required: true },
  dobMonth: { type: Number, required: true },

  // (optional: keep old dob for now)
  dob: { type: Date },

  fatherName: { type: String, default: "" },
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);