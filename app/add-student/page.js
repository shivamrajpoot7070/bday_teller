"use client";

import { addStudent } from "@/actions/studentActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddStudent() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(formData) {
    setLoading(true);
    setToast(null);

    const res = await addStudent(formData);

    setLoading(false);

    if (res.success) {
      setToast({ type: "success", message: "🎉 Birthday Added!" });

      // redirect after small delay (so user sees toast)
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setToast({ type: "error", message: res.message });
    }
  }

  return (
    <div className="form-container">

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
          {toast.message}
        </div>
      )}

      <div className="form-box">
        <h1>🎂 Add Student</h1>

        <form action={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input"
            required
          />

          <input
            type="text"
            name="class"
            placeholder="Class"
            className="input"
            required
          />

          <input
            type="date"
            name="dob"
            className="input"
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