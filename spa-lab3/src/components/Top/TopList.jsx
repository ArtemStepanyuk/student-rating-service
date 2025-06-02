import React, { useEffect, useState } from 'react';
import { fetchRatings } from '../../api/api';

export default function TopList() {
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await fetchRatings();
        const result = list.map(r => {
          const scores = Object.values(r.subjects).map(s =>
            s.lab1 + s.lab2 + s.lab3 + s.lab4 + s.lab5 + s.test
          );
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return { name: r.name, score: +avg.toFixed(2) };
        }).filter(r => r.score >= 85);

        setTop(result);
      } catch (e) {
        console.error(e);
        alert('Ошибка при загрузке топ-студентов: ' + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading top students…</p>;
  if (top.length === 0) return <p>No students with average ≥ 85.</p>;

  return (
    <section className="top-section">
      <h2>Top Students (average ≥ 85)</h2>
      <ul className="top-list">
        {top.map(t => (
          <li key={t.name}>{t.name} — {t.score}</li>
        ))}
      </ul>
    </section>
  );
}
