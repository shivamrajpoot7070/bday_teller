import { getTodaysBirthdays } from "@/actions/studentActions";
import Link from "next/link";

export default async function Home() {
  const students = await getTodaysBirthdays();

  return (
    <div className="home-page">

      {/* 🔥 Header */}
      <div className="marquee">
        <h1>🎉 Birthday Dashboard 🎂 Birthday Dashboard 🎉</h1>
      </div>

      {/* 📦 Main Layout */}
      <div className="container">

        {/* 🎂 LEFT SIDE */}
        <div className="card left-card">
          <h2 className="section-title">🎂 Today's Birthdays</h2>

          {students.length === 0 ? (
            <p className="empty">No birthdays today 🎈</p>
          ) : (
            <div className="bday-list">
              {students.map((s, i) => (
                <div key={s._id} className="bday-item">
                  <h3 className={`name${(i % 3) + 1}`}>{s.name}</h3>
                  <p className={`class${(i % 2) + 1}`}>
                    Class {s.class}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ➕ RIGHT SIDE */}
        <div className="card right-card">

          <h2 className="section-title">⚡ Quick Actions</h2>

          <p className="subtitle">
            Manage students and birthdays easily
          </p>

          <div className="actions">

            <Link href="/add-student" className="btn">
              ➕ Add Student
            </Link>

            <Link href="/students" className="btn secondary">
              📚 View All Students
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}