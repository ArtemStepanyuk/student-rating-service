/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserForm from "./UserForm";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock("../../api/api", () => ({
  fetchUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn()
}));

import { useParams, useNavigate } from "react-router-dom";
import { fetchUsers, createUser, updateUser } from "../../api/api";

describe("UserForm", () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders an empty form for creating a new user", () => {
    useParams.mockReturnValue({ id: undefined });

    render(<UserForm />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("New User");
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toHaveValue("regular");
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("calls createUser on form submit", async () => {
    useParams.mockReturnValue({ id: undefined });
    createUser.mockResolvedValue({ id: "123", name: "Ivan", role: "admin" });

    render(<UserForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Ivan" } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "admin" } });
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith(
        { name: "Ivan", role: "admin" },
        { name: "Ivan", role: "admin" }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });
  });

  it("loads data with fetchUsers and fills the form in edit mode", async () => {
    useParams.mockReturnValue({ id: "5" });
    fetchUsers.mockResolvedValue([
      { id: "4", name: "Another", role: "regular" },
      { id: "5", name: "Peter", role: "admin" }
    ]);

    render(<UserForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue("Peter");
      expect(screen.getByLabelText(/Role/i)).toHaveValue("admin");
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Edit Peter");
    });
  });

  it("calls updateUser on form submit in edit mode", async () => {
    useParams.mockReturnValue({ id: "5" });
    fetchUsers.mockResolvedValue([{ id: "5", name: "Peter", role: "admin" }]);
    updateUser.mockResolvedValue({ id: "5", name: "Peter", role: "regular" });

    render(<UserForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue("Peter");
    });

    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "regular" } });
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith("5", { name: "Peter", role: "regular" });
      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });
  });

  it("Cancel navigates to /users without calling API", () => {
    useParams.mockReturnValue({ id: undefined });

    render(<UserForm />);
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(createUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/users");
  });
});
