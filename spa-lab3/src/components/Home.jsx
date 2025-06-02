// spa-lab3/src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

export default function Home() {
  const [userCount, setUserCount] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [topStudents, setTopStudents] = useState(null);

  const calcAverageForOne = (subjects) => {
    const perSubjectTotals = Object.values(subjects).map((subj) => {
      return Object.values(subj).reduce((sum, val) => sum + Number(val || 0), 0);
    });
    if (perSubjectTotals.length === 0) return 0;
    const sumAll = perSubjectTotals.reduce((a, b) => a + b, 0);
    return sumAll / perSubjectTotals.length;
  };

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((users) => {
        setUserCount(users.length);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setUserCount(0);
      });

    fetch(`${API_BASE}/ratings`)
      .then((res) => res.json())
      .then((ratings) => {
        setRatingCount(ratings.length);

        const perStudentAverages = ratings.map((r) =>
          calcAverageForOne(r.subjects)
        );
        if (perStudentAverages.length === 0) {
          setAvgRating('0.00');
        } else {
          const totalSum = perStudentAverages.reduce((a, b) => a + b, 0);
          const overallAvg = (totalSum / perStudentAverages.length).toFixed(2);
          setAvgRating(overallAvg);
        }

        const enriched = ratings.map((r) => ({
          id: r.id,
          name: r.name,
          avg: calcAverageForOne(r.subjects),
        }));
        enriched.sort((a, b) => b.avg - a.avg);
        setTopStudents(enriched.slice(0, 3));
      })
      .catch((err) => {
        console.error('Error fetching ratings:', err);
        setRatingCount(0);
        setAvgRating('0.00');
        setTopStudents([]);
      });
  }, []);

  return (
    <section className="home-page" style={{ padding: '1rem' }}>
      <h2>Welcome to the Student Rating Service!</h2>
      <p>
        Here you can manage users, assign and track ratings, and follow the top students.
      </p>

      <div
        className="stats-cards"
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}
      >
        <div
          className="card"
          style={{
            flex: '1 1 200px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
            {userCount !== null ? userCount : '...'}
          </p>
          <Link to="/users" className="btn">
            Go to Users
          </Link>
        </div>

        <div
          className="card"
          style={{
            flex: '1 1 200px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3>Total Ratings Records</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
            {ratingCount !== null ? ratingCount : '...'}
          </p>
          <p>
            Average Score of All Students:{' '}
            {avgRating !== null ? avgRating : '...'}
          </p>
          <Link to="/ratings" className="btn">
            Go to Ratings
          </Link>
        </div>

        <div
          className="card"
          style={{
            flex: '1 1 200px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3>Top 3 Students</h3>

          {topStudents === null && <p>Loading...</p>}

          {topStudents !== null && topStudents.length === 0 && (
            <p>No data for top students</p>
          )}

          {topStudents !== null && topStudents.length > 0 && (
            <ol style={{ paddingLeft: '1.2rem' }}>
              {topStudents.map((stu) => (
                <li key={stu.id} style={{ marginBottom: '0.5rem' }}>
                  {stu.name} — {stu.avg.toFixed(2)}
                </li>
              ))}
            </ol>
          )}

          <Link to="/top" className="btn">
            All Top Students
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <CountdownTimer targetMonth={8} targetDay={1} />
      </div>
    </section>
  );
}

function CountdownTimer({ targetMonth, targetDay }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, targetMonth, targetDay, 0, 0, 0);
    if (now >= target) {
      target = new Date(year + 1, targetMonth, targetDay, 0, 0, 0);
    }
    const diff = target - now;
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, seconds } = timeLeft;
  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '1rem',
        background: '#f0f8ff',
        border: '1px solid #007acc',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Time Until Next Semester Starts:</h3>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {days} days {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#555', marginTop: '0.25rem' }}>
        (September 1)
      </div>
    </div>
  );
}
