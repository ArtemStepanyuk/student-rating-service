import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Logout() {
  const { logout } = useContext(AuthContext);
  useEffect(() => { logout(); }, []);
  return (
    <section className="message-section">
      <h2>Logged out</h2>
      <p>You have been logged out. <a href="/login">Log in again</a>.</p>
    </section>
  );
}
