import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    login('dummy-token');
    nav('/');
  }

  return (
    <section className="auth-section">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Username
          <input value={username}
                 onChange={e => setUsername(e.target.value)}
                 required/>
        </label>
        <label>
          Password
          <input type="password"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 required/>
        </label>
        <button type="submit" className="btn">Log In</button>
      </form>
    </section>
  );
}
