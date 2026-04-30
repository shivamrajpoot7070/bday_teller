import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // OLD FIELD (keep for UI compatibility)
    class: { type: String, required: true },

    // NEW CLEAN STRUCTURE
    className: { type: String },
    section: { type: String, default: "" },

    dob: { type: Date, required: true },
    fatherName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);