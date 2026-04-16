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

    await Student.create({
      name,
      class: studentClass,
      dob: new Date(dob),
    });

    // 🔥 THIS IS IMPORTANT
    revalidatePath("/");

    return { success: true };
  } catch (error) {
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