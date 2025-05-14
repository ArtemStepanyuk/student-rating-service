const BASE = 'http://localhost:3000';

async function handleRes(res) {
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${BASE}/users`);
  return handleRes(res);
}
export async function createUser(user) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return handleRes(res);
}
export async function updateUser(id, user) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return handleRes(res);
}
export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.statusText);
}

export async function fetchRatings() {
  const res = await fetch(`${BASE}/ratings`);
  return handleRes(res);
}
export async function fetchRatingById(id) {
  const res = await fetch(`${BASE}/ratings/${id}`);
  return handleRes(res);
}
export async function createRating(rating) {
  const res = await fetch(`${BASE}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rating)
  });
  return handleRes(res);
}
export async function updateRating(id, rating) {
  const res = await fetch(`${BASE}/ratings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rating)
  });
  return handleRes(res);
}
