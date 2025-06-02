/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "./UserList";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

jest.mock("../../api/api", () => ({
  fetchUsers: jest.fn(),
  deleteUser: jest.fn()
}));

import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../../api/api";

describe("UserList", () => {
  let mockNavigate;
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders a table with users", async () => {
    fetchUsers.mockResolvedValue([
      { id: "1", name: "Ivan", role: "regular" },
      { id: "2", name: "Peter", role: "admin" }
    ]);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("Ivan")).toBeInTheDocument();
      expect(screen.getByText("Peter")).toBeInTheDocument();
    });
  });

  it("Add button navigates to /users/create", async () => {
    fetchUsers.mockResolvedValue([]);
    render(<UserList />);

    fireEvent.click(screen.getByText("Add"));
    expect(mockNavigate).toHaveBeenCalledWith("/users/create");
  });

  it("✎ button navigates to /users/edit/:id", async () => {
    fetchUsers.mockResolvedValue([{ id: "3", name: "Maria", role: "regular" }]);
    render(<UserList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("✎"));
    });
    expect(mockNavigate).toHaveBeenCalledWith("/users/edit/3");
  });

  it("🗑 button calls deleteUser and refreshes the list", async () => {
    window.confirm = jest.fn(() => true);

    fetchUsers.mockResolvedValueOnce([
      { id: "1", name: "Anna", role: "admin" }
    ]).mockResolvedValueOnce([]);
    deleteUser.mockResolvedValue();

    render(<UserList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("🗑"));
    });

    expect(deleteUser).toHaveBeenCalledWith("1");
    expect(fetchUsers).toHaveBeenCalledTimes(2);
  });
});
