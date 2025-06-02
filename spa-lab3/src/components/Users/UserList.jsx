import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  function onDelete(id) {
    if (!confirm('Delete user?')) return;
    deleteUser(id).then(() => fetchUsers().then(setUsers));
  }

  return (
    <section>
      <h2>Users</h2>
      <button className="btn" onClick={() => nav('/users/create')}>Add</button>
      <table className="table">
        <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn" onClick={() => nav(`/users/edit/${u.id}`)}>✎</button>
                <button className="btn" onClick={() => onDelete(u.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
