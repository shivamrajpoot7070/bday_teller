import { getStudentsByClass } from "@/actions/studentActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const data = await getStudentsByClass();

 const classes = Object.keys(data).sort((a, b) => {
  const baseOrder = ["PG", "Nursery", "LKG", "UKG"];

  // 1. Handle base classes first
  const aIndex = baseOrder.indexOf(a);
  const bIndex = baseOrder.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  // 2. Extract numeric + section (e.g., 1A, 2B)
  const regex = /^(\d+)([A-Za-z]*)$/;

  const aMatch = a.match(regex);
  const bMatch = b.match(regex);

  if (aMatch && bMatch) {
    const numA = parseInt(aMatch[1]);
    const numB = parseInt(bMatch[1]);

    if (numA !== numB) return numA - numB;

    return aMatch[2].localeCompare(bMatch[2]);
  }

  // 3. fallback
  return a.localeCompare(b);
});

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
          <h2>Class: {cls}</h2>

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