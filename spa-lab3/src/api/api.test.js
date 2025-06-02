// src/api/api.test.js
/**
 * @jest-environment jsdom
 */

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchRatings,
  fetchRatingById,
  createRating,
  updateRating
} from "./api";

describe("API layer (using fetch)", () => {
  const BASE = "http://localhost:3000";

  beforeEach(() => {
    // каждый раз перед тестом очищаем mock для global.fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // UTILITY: создаём «фейковый» Response
  function mockResponse(status, statusText, response) {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: () => Promise.resolve(response)
    });
  }

  describe("Users endpoints", () => {
    it("fetchUsers делает GET /users и возвращает JSON", async () => {
      const fakeUsers = [{ id: "1", name: "Иван", role: "regular" }];
      global.fetch.mockResolvedValue(mockResponse(200, "OK", fakeUsers));

      const result = await fetchUsers();
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/users`);
      expect(result).toEqual(fakeUsers);
    });

    it("createUser делает POST /users с телом и возвращает созданного пользователя", async () => {
      const newUser = { name: "Пётр", role: "admin" };
      const createdUser = { id: "2", ...newUser };
      global.fetch.mockResolvedValue(mockResponse(201, "Created", createdUser));

      const result = await createUser(newUser);
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      expect(result).toEqual(createdUser);
    });

    it("updateUser делает PUT /users/:id с телом и возвращает обновлённого", async () => {
      const upd = { name: "Иван Петров", role: "regular" };
      const returned = { id: "1", ...upd };
      global.fetch.mockResolvedValue(mockResponse(200, "OK", returned));

      const result = await updateUser("1", upd);
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/users/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upd)
      });
      expect(result).toEqual(returned);
    });

    it("deleteUser делает DELETE /users/:id и не возвращает JSON", async () => {
      // Для deleteUser handleRes не вызывается (там проверяется только res.ok)
      global.fetch.mockResolvedValue({
        ok: true,
        status: 204,
        statusText: "No Content"
      });

      await expect(deleteUser("1")).resolves.toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/users/1`, {
        method: "DELETE"
      });
    });
  });

  describe("Ratings endpoints", () => {
    it("fetchRatings делает GET /ratings", async () => {
      const fakeRatings = [{ id: "1", name: "Иван", subjects: {} }];
      global.fetch.mockResolvedValue(mockResponse(200, "OK", fakeRatings));

      const result = await fetchRatings();
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/ratings`);
      expect(result).toEqual(fakeRatings);
    });

    it("fetchRatingById делает GET /ratings/:id", async () => {
      const fake = { id: "1", name: "Иван", subjects: {} };
      global.fetch.mockResolvedValue(mockResponse(200, "OK", fake));

      const result = await fetchRatingById("1");
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/ratings/1`);
      expect(result).toEqual(fake);
    });

    it("createRating делает POST /ratings", async () => {
      const rating = { name: "Иван", subjects: {} };
      const created = { id: "2", ...rating };
      global.fetch.mockResolvedValue(mockResponse(201, "Created", created));

      const result = await createRating(rating);
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rating)
      });
      expect(result).toEqual(created);
    });

    it("updateRating делает PUT /ratings/:id", async () => {
      const upd = { name: "Иван", subjects: {} };
      const returned = { id: "1", ...upd };
      global.fetch.mockResolvedValue(mockResponse(200, "OK", returned));

      const result = await updateRating("1", upd);
      expect(global.fetch).toHaveBeenCalledWith(`${BASE}/ratings/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upd)
      });
      expect(result).toEqual(returned);
    });
  });
});
