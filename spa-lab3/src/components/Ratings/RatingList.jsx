import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchRatings, createRating } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  'Mathematics',
  'Web Programming',
  'Project Management',
  'Computer Networks',
  'English'
];

export default function RatingList() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [users, ratings] = await Promise.all([
          fetchUsers(),
          fetchRatings()
        ]);
        const regular = users.filter(u => u.role === 'regular');
        const rr = await Promise.all(regular.map(async u => {
          let r = ratings.find(r => r.name === u.name);
          if (!r) {
            const zeroSubjects = {};
            SUBJECTS.forEach(subj => {
              zeroSubjects[subj] = { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 };
            });
            r = await createRating({
              name: u.name,
              group: u.group || '',
              subjects: zeroSubjects
            });
          }
          const totals = SUBJECTS.map(subj => {
            const s = r.subjects[subj];
            return s.lab1 + s.lab2 + s.lab3 + s.lab4 + s.lab5 + s.test;
          });
          const avg = (totals.reduce((a, b) => a + b, 0) / SUBJECTS.length).toFixed(2);
          return { id: r.id, name: r.name, group: r.group || '', avg };
        }));
        setRows(rr);
      } catch (e) {
        console.error(e);
        alert('Error loading ratings: ' + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading ratings…</p>;

  return (
    <section className="ratings-section">
      <h2>Student Ratings</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Group</th><th>Average Score</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.group}</td>
              <td>{r.avg}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => nav(`/ratings/edit/${r.id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
