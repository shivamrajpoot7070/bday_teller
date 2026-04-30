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

        {/* 🔙 Back Button */}
        <button
          onClick={() => router.push("/")}
          className="back-btn"
          disabled={loading}
        >
          ← Back
        </button>

        <h1>🎂 Add Student</h1>

        <form action={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input"
            disabled={loading}
            required
          />

          <input
            type="text"
            name="class"
            placeholder="Class"
            className="input"
            disabled={loading}
            required
          />

          <input
            type="text"
            name="fatherName"
            placeholder="Father Name (optional)"
            className="input"
            disabled={loading}
          />

          <input
            type="date"
            name="dob"
            className="input"
            disabled={loading}
            required
          />

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