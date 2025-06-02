import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../components/Home';
import Login from '../components/Auth/Login';
import Logout from '../components/Auth/Logout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';

import RatingList from '../components/Ratings/RatingList';
import RatingForm from '../components/Ratings/RatingForm';

import TopList from '../components/Top/TopList';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
        <Route path="/ratings" element={<RatingList />} />
        <Route path="/ratings/edit/:id" element={<RatingForm />} />
        <Route path="/top" element={<TopList />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
