import { getTodaysBirthdays } from "@/actions/studentActions";
import Link from "next/link";

export default async function Home() {
  const students = await getTodaysBirthdays();

  return (
    <div>

      {/* Moving Header */}
      <div className="marquee">
        <h1>🎉 Birthday Dashboard 🎂 Birthday Dashboard 🎉</h1>
      </div>

      <div className="container">

        {/* Left: Birthdays */}
        <div className="card">
          <h2>Today's Birthdays</h2>

          {students.length === 0 ? (
            <p>No birthdays today 🎈</p>
          ) : (
            students.map((s, i) => (
              <div key={s._id} className="bday-item">
                <h3 className={`name${(i % 3) + 1}`}>{s.name}</h3>
                <p className={`class${(i % 2) + 1}`}>
                  Class: {s.class}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right: Add Student */}
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Add Student</h2>
          <p>Quickly add birthdays 🎂</p>

          <br />

          <Link href="/add-student" className="btn">
            ➕ Add Student
          </Link>
        </div>

      </div>
    </div>
  );
}