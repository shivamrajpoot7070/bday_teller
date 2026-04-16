import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    dob: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);