"use server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

import { revalidatePath } from "next/cache";

export async function addStudent(formData) {
  try {
    await connectDB();

    const name = formData.get("name");
    const studentClass = formData.get("class");
    const dob = formData.get("dob");


  const fatherName = formData.get("fatherName");

await Student.create({
  name,
  class: studentClass,
  dob: new Date(dob),
  fatherName: fatherName || "", // ✅ fallback
});

    // 🔥 THIS IS IMPORTANT
    revalidatePath("/");

    return { success: true };
  } 
  catch (error) {
    return { success: false, message: error.message };
  }
}

// ➤ Get Today's Birthdays
export async function getTodaysBirthdays() {
  try {
    await connectDB();

    const today = new Date();

    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1;

    const students = await Student.aggregate([
      {
        $addFields: {
          day: { $dayOfMonth: "$dob" },
          month: { $month: "$dob" },
        },
      },
      {
        $match: {
          day: day,
          month: month,
        },
      },
    ]);
    console.log(students);

    return students;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export async function getStudentsByClass() {
  try {
    await connectDB();

    const students = await Student.find().sort({ class: 1 });

    // Group by class
    const grouped = {};

    students.forEach((student) => {
      const cls = student.class;

      if (!grouped[cls]) {
        grouped[cls] = [];
      }

      grouped[cls].push(student);
    });

    return grouped;
  } catch (error) {
    console.error(error);
    return {};
  }
}