import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <>
      <header className="site-header">
        <h1>Student Rating Service</h1>
        {isAuth && (
          <nav className="site-nav">
            <NavLink to="/"         end>Home</NavLink>
            <NavLink to="/users">   Users</NavLink>
            <NavLink to="/ratings"> Ratings</NavLink>
            <NavLink to="/top">     Top Students</NavLink>
            <NavLink to="/logout">  Logout</NavLink>
          </nav>
        )}
      </header>

      <main>
        <AppRoutes />
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 Web Development Department</p>
      </footer>
    </>
  );
}
