"use server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { revalidatePath } from "next/cache";

// 🔥 NORMALIZER
function normalizeClassAndSection(input) {
  if (!input) return { className: "", section: "", display: "" };

  const value = input.trim().toUpperCase();

  const special = ["PG", "NURSERY", "LKG", "UKG"];

  if (special.includes(value)) {
    const formatted = value === "NURSERY" ? "Nursery" : value;

    return {
      className: formatted,
      section: "",
      display: formatted,
    };
  }

  const match = value.match(/^(\d+)([A-Z]*)$/);

  if (match) {
    const className = match[1];
    const section = match[2] || "";

    return {
      className,
      section,
      display: className + section,
    };
  }

  return {
    className: value,
    section: "",
    display: value,
  };
}

// ➕ ADD STUDENT
export async function addStudent(formData) {
  try {
    await connectDB();

    const name = formData.get("name");
    const dob = formData.get("dob");
    const fatherName = formData.get("fatherName");

    const rawClass = formData.get("class");

    if (!rawClass) {
  return { success: false, message: "Class is required" };
}
    const sectionInput = (formData.get("section") || "").toUpperCase();

    const combinedClass = rawClass + sectionInput;

    // ✅ FIX HERE
    const { className, section, display } =
      normalizeClassAndSection(combinedClass);

    await Student.create({
      name,
      class: display,       // UI uses this
      className,            // clean field
      section,              // clean field
      dob: new Date(dob),
      fatherName: fatherName || "",
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// 🎂 TODAY BIRTHDAYS
export async function getTodaysBirthdays() {
  try {
    await connectDB();

    const today = new Date();

    const day = today.getDate();       // ✅ local
    const month = today.getMonth();    // ✅ local

    const students = await Student.find();

    const result = [];

    for (const s of students) {
      if (!s.className) {
        const { className, section, display } =
          normalizeClassAndSection(s.class);

        s.className = className;
        s.section = section;
        s.class = display;

        await s.save();
      }

      const dob = new Date(s.dob);

      if (
        dob.getDate() === day &&       // ✅ local
        dob.getMonth() === month       // ✅ local
      ) {
        result.push(s);
      }
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 📚 GROUP BY CLASS
export async function getStudentsByClass() {
  try {
    await connectDB();

    const students = await Student.find();

    const grouped = {};

    for (const s of students) {
      // 🔥 AUTO FIX OLD DATA
      if (!s.className) {
        const { className, section, display } =
          normalizeClassAndSection(s.class);

        s.className = className;
        s.section = section;
        s.class = display;

        await s.save();
      }

      const key = s.className;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(s);
    }

    return grouped;
  } catch (error) {
    console.error(error);
    return {};
  }
}