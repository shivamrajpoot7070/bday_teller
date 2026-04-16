"use server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

// ➤ Add Student
export async function addStudent(formData) {
  try {
    await connectDB();

    const name = formData.get("name");
    const studentClass = formData.get("class");
    const dob = formData.get("dob");

    if (!name || !studentClass || !dob) {
      throw new Error("All fields are required");
    }

    await Student.create({
      name,
      class: studentClass,
      dob: new Date(dob),
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// ➤ Get Today's Birthdays
export async function getTodaysBirthdays() {
  try {
    await connectDB();

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-based

    const students = await Student.find();

    const todaysBirthdays = students.filter((student) => {
      const dob = new Date(student.dob);
      return dob.getDate() === day && dob.getMonth() === month;
    });

    return todaysBirthdays;
  } catch (error) {
    console.error(error);
    return [];
  }
}