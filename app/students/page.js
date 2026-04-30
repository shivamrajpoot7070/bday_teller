import { getStudentsByClass } from "@/actions/studentActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const data = await getStudentsByClass();

  const classes = Array.from({ length: 10 }, (_, i) => String(i + 1));

  return (
    <div className="students-page">

      {/* 🔙 Back to Home */}
      <div style={{ marginBottom: "10px" }}>
        <Link href="/" className="back-btn">
          ← Back to Home
        </Link>
      </div>

      <h1 className="title">📚 Students Directory</h1>

      {classes.map((cls) => (
        <div key={cls} className="card" style={{ marginBottom: "20px" }}>
          <h2>Class {cls}</h2>

          {data[cls]?.length ? (
            <div className="student-grid">
              {data[cls].map((s) => (
                <div key={s._id} className="student-card">
                  <h3 className="student-name">{s.name}</h3>

                  <p>
                    👨 Father:{" "}
                    {s.fatherName?.trim() ? s.fatherName : "NA"}
                  </p>

                  <p>
                    🎂 DOB:{" "}
                    {new Date(s.dob).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty">No students</p>
          )}
        </div>
      ))}
    </div>
  );
}