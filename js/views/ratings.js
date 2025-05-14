import {
  fetchRatings,
  fetchRatingById,
  updateRating,
  createRating
} from '../api.js';
import { fetchUsers } from '../api.js';

const SUBJECTS = [
  'Mathematics',
  'Web Programming',
  'Project Management',
  'Computer Networks',
  'English'
];

export async function renderRatings(container) {
  container.innerHTML = '<p>Loading...</p>';
  try {
    const [users, ratings] = await Promise.all([
      fetchUsers(),
      fetchRatings()
    ]);
    const regular = users.filter(u => u.role === 'regular');
    const rows = await Promise.all(regular.map(async u => {
      let r = ratings.find(r => r.name === u.name);
      if (!r) {
        const zeroSubjects = {};
        for (const subj of SUBJECTS) {
          zeroSubjects[subj] = { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 };
        }
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
      const avg = (totals.reduce((a,b) => a + b, 0) / SUBJECTS.length).toFixed(2);
      return `
        <tr>
          <td>${r.name}</td>
          <td>${r.group || ''}</td>
          <td>${avg}</td>
          <td>
            <button class="btn" onclick="location.hash='ratings/edit/${r.id}'">
              Edit
            </button>
          </td>
        </tr>
      `;
    }));

    container.innerHTML = `
      <h2>Student Ratings</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th><th>Group</th><th>Average Score</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
    `;
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

export async function renderEditRating(container, id) {
  container.innerHTML = '<p>Loading form...</p>';
  try {
    const r = await fetchRatingById(id);
    const formRows = SUBJECTS.map(subj => {
      const s = r.subjects[subj] || { lab1:0,lab2:0,lab3:0,lab4:0,lab5:0,test:0 };
      return `
        <fieldset>
          <legend>${subj}</legend>
          ${[1,2,3,4,5].map(i => `
            <label>Lab ${i}
              <input type="number" name="${subj}-lab${i}"
                     value="${s['lab'+i]}" min="0" max="10">
            </label>
          `).join('')}
          <label>Test
            <input type="number" name="${subj}-test"
                   value="${s.test}" min="0" max="50">
          </label>
        </fieldset>
      `;
    }).join('');

    container.innerHTML = `
      <h2>Edit Rating: ${r.name}</h2>
      <form id="rating-form" class="form-edit">
        <label>Group: <input name="group" value="${r.group || ''}" required></label>
        ${formRows}
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn" onclick="location.hash='ratings'">Cancel</button>
      </form>
    `;

    document.getElementById('rating-form').onsubmit = async e => {
      e.preventDefault();
      const newSubjects = {};
      for (const subj of SUBJECTS) {
        newSubjects[subj] = {
          lab1: +e.target[`${subj}-lab1`].value,
          lab2: +e.target[`${subj}-lab2`].value,
          lab3: +e.target[`${subj}-lab3`].value,
          lab4: +e.target[`${subj}-lab4`].value,
          lab5: +e.target[`${subj}-lab5`].value,
          test: +e.target[`${subj}-test`].value
        };
      }
      await updateRating(id, {
        name: r.name,
        group: e.target.group.value,
        subjects: newSubjects
      });
      location.hash = 'ratings';
    };
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
