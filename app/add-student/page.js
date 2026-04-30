"use client";

import { addStudent } from "@/actions/studentActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddStudent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(formData) {
    if (loading) return;

    setLoading(true);
    setToast(null);

    const res = await addStudent(formData);

    if (res.success) {
      setToast({ type: "success", message: "🎉 Birthday Added!" });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setToast({ type: "error", message: res.message });
      setLoading(false);
    }
  }

  return (
    <div className="form-container">

      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
          {toast.message}
        </div>
      )}

      <div className="form-box">

        {/* 🔙 Back */}
        <button
          onClick={() => router.push("/")}
          className="back-btn"
          disabled={loading}
        >
          ← Back
        </button>

        <h1>🎂 Add Student</h1>

        <form action={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input"
            disabled={loading}
            required
          />

          {/* 🔥 Class Dropdown */}
          <select
            name="class"
            className="input"
            disabled={loading}
            required
          >
            <option value="">Select Class</option>
            <option value="PG">PG</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>

          {/* 🔥 Section (optional) */}
          <input
            type="text"
            name="section"
            placeholder="Section (A, B, C - optional)"
            className="input"
            disabled={loading}
            maxLength={2}
          />

          {/* Father Name */}
          <input
            type="text"
            name="fatherName"
            placeholder="Father Name (optional)"
            className="input"
            disabled={loading}
          />

          {/* DOB */}
          <input
            type="date"
            name="dob"
            className="input"
            disabled={loading}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Student 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}