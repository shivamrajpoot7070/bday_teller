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

// ➕ ADD STUDENT (FIXED DOB + CLASS)
export async function addStudent(formData) {
  try {

    await connectDB();

    const name = formData.get("name");
    
    const fatherName = formData.get("fatherName");

    const dobInput = formData.get("dob"); // YYYY-MM-DD

const [year, month, day] = dobInput.split("-");

const dobDay = parseInt(day);
const dobMonth = parseInt(month);

    const rawClass = formData.get("class");
    const sectionInput = (formData.get("section") || "").toUpperCase();

    if (!rawClass) {
      return { success: false, message: "Class is required" };
    }

    const combinedClass = rawClass + sectionInput;

    // ✅ FIX: Proper destructuring
    const { className, section, display } =
      normalizeClassAndSection(combinedClass);

    // ✅ FIX: Store DOB in UTC midnight
    const dobDate = new Date(dobInput + "T00:00:00.000Z");

    await Student.create({
  name,
  class: display,
  className,
  section,
  dobDay,
  dobMonth,
  dob: new Date(dobInput),
  fatherName: fatherName || "",
});

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// 🎂 TODAY BIRTHDAYS (UTC SAFE)
export async function getTodaysBirthdays() {
  try {
    await connectDB();

    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;

    const students = await Student.find();

    const result = [];

    for (const s of students) {
      // 🔥 auto-fix old data
      if (!s.dobDay || !s.dobMonth) {
        const dob = new Date(s.dob);

        s.dobDay = dob.getDate();
        s.dobMonth = dob.getMonth() + 1;

        await s.save();
      }

      if (s.dobDay === day && s.dobMonth === month) {
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