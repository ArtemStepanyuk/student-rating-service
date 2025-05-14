import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  createRating
} from '../api.js';

const SUBJECTS = [
  'Mathematics',
  'Web Programming',
  'Project Management',
  'Computer Networks',
  'English'
];

export async function renderUsers(container) {
  container.innerHTML = '<p>Loading users...</p>';
  try {
    const users = await fetchUsers();
    const rows = users.map(u => `
      <tr data-id="${u.id}">
        <td>${u.name}</td>
        <td>${u.role}</td>
        <td>
          <button class="btn edit-btn">✎</button>
          <button class="btn delete-btn">🗑</button>
        </td>
      </tr>
    `).join('');

    container.innerHTML = `
      <h2>Users</h2>
      <button class="btn" id="add-user-btn">Add</button>
      <table class="table">
        <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    document.getElementById('add-user-btn')
      .addEventListener('click', () => location.hash = 'users/create');

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.closest('tr').dataset.id;
        location.hash = `users/edit/${id}`;
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const row = e.target.closest('tr');
        const id = row.dataset.id;
        if (!confirm('Delete user?')) return;
        try {
          await deleteUser(id);
          renderUsers(container);
        } catch (err) {
          alert('Delete error: ' + err.message);
        }
      });
    });

  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

export function renderCreateUser(container) {
  container.innerHTML = `
    <h2>New User</h2>
    <form id="form-create" class="form-create">
      <label>Name<input name="name" required></label>
      <label>Role
        <select name="role" required>
          <option value="admin">Admin</option>
          <option value="regular" selected>Regular</option>
        </select>
      </label>
      <button type="submit" class="btn">Create</button>
      <button type="button" class="btn" id="cancel-create">Cancel</button>
    </form>
  `;
  document.getElementById('cancel-create')
    .addEventListener('click', () => location.hash = 'users');

  document.getElementById('form-create').onsubmit = async e => {
    e.preventDefault();
    const newUser = await createUser({
      name: e.target.name.value,
      role: e.target.role.value
    });
    if (newUser.role === 'regular') {
      const subjects = {};
      for (const subj of SUBJECTS) {
        subjects[subj] = { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 };
      }
      await createRating({
        name: newUser.name,
        group: '',
        subjects
      });
    }
    location.hash = 'users';
  };
}

export async function renderEditUser(container, id) {
  container.innerHTML = '<p>Loading data...</p>';
  try {
    const users = await fetchUsers();
    const user = users.find(u => u.id == id);
    container.innerHTML = `
      <h2>Edit ${user.name}</h2>
      <form id="form-edit" class="form-edit">
        <label>Name<input name="name" value="${user.name}" required></label>
        <label>Role
          <select name="role">
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="regular" ${user.role === 'regular' ? 'selected' : ''}>Regular</option>
          </select>
        </label>
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn" id="cancel-edit">Cancel</button>
      </form>
    `;
    document.getElementById('cancel-edit')
      .addEventListener('click', () => location.hash = 'users');

    document.getElementById('form-edit').onsubmit = async e => {
      e.preventDefault();
      await updateUser(id, {
        name: e.target.name.value,
        role: e.target.role.value
      });
      location.hash = 'users';
    };
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
