import { fetchRatings } from '../api.js';

export async function renderTop(container) {
  container.innerHTML = '<p>Loading...</p>';
  try {
    const list = await fetchRatings();
    const valid = list.filter(r => r && r.subjects);

    const top = valid.map(r => {
      const subjectScores = Object.values(r.subjects).map(s =>
        s.lab1 + s.lab2 + s.lab3 + s.lab4 + s.lab5 + s.test
      );
      const average = subjectScores.length > 0
        ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length
        : 0;

      return { name: r.name, score: +average.toFixed(2) };
    }).filter(r => r.score >= 85);

    if (top.length === 0) {
      container.innerHTML = '<p>No students with an average score ≥ 85.</p>';
      return;
    }

    container.innerHTML = `
      <h2>Top Students (average ≥ 85)</h2>
      <ul class="top-list">
        ${top.map(t => `<li>${t.name} — ${t.score}</li>`).join('')}
      </ul>
    `;
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
