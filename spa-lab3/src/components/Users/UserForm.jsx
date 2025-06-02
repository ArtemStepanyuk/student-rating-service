import React, { useEffect, useState } from 'react';
import { createUser, updateUser, fetchUsers } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [name, setName] = useState('');
  const [role, setRole] = useState('regular');
  const nav = useNavigate();

  useEffect(() => {
    if (isEdit) {
      fetchUsers().then(list => {
        const u = list.find(x => x.id === id);
        setName(u.name);
        setRole(u.role);
      });
    }
  }, [id]);

  function onSubmit(e) {
    e.preventDefault();
    const fn = isEdit ? updateUser : createUser;
    fn(isEdit ? id : { name, role }, isEdit ? { name, role } : { name, role })
      .then(() => nav('/users'));
  }

  return (
    <section>
      <h2>{isEdit ? `Edit ${name}` : 'New User'}</h2>
      <form className="form-create" onSubmit={onSubmit}>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Role
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="regular">Regular</option>
          </select>
        </label>
        <button type="submit" className="btn">Save</button>
        <button type="button" className="btn" onClick={() => nav('/users')}>Cancel</button>
      </form>
    </section>
  );
}
