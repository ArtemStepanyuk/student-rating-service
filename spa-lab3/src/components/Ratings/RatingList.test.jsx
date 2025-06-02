/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RatingList from "./RatingList";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));
jest.mock("../../api/api", () => ({
  fetchUsers: jest.fn(),
  fetchRatings: jest.fn(),
  createRating: jest.fn()
}));

import { useNavigate } from "react-router-dom";
import { fetchUsers, fetchRatings, createRating } from "../../api/api";

describe("RatingList", () => {
  let mockNavigate;
  const SUBJECTS = [
    "Mathematics",
    "Web Programming",
    "Project Management",
    "Computer Networks",
    "English"
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders Loading and then a table with data (when ratings exist)", async () => {
    const fakeUsers = [
      { id: "1", name: "John", role: "regular", group: "G1" },
      { id: "2", name: "Admin", role: "admin", group: "G0" }
    ];
    const fakeRatings = [
      {
        id: "10",
        name: "John",
        group: "G1",
        subjects: {
          Mathematics: { lab1: 5, lab2: 5, lab3: 5, lab4: 5, lab5: 5, test: 10 },
          "Web Programming": { lab1: 4, lab2: 4, lab3: 4, lab4: 4, lab5: 4, test: 8 },
          "Project Management": { lab1: 3, lab2: 3, lab3: 3, lab4: 3, lab5: 3, test: 6 },
          "Computer Networks": { lab1: 2, lab2: 2, lab3: 2, lab4: 2, lab5: 2, test: 4 },
          English: { lab1: 1, lab2: 1, lab3: 1, lab4: 1, lab5: 1, test: 2 }
        }
      }
    ];
    fetchUsers.mockResolvedValue(fakeUsers);
    fetchRatings.mockResolvedValue(fakeRatings);

    render(<RatingList />);

    expect(screen.getByText(/Loading ratings…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/Student Ratings/i);
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("21.00")).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: /Edit/i });
    expect(editBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/ratings/edit/10");
  });

  it("calls createRating if a regular user has no rating", async () => {
    const fakeUsers = [
      { id: "1", name: "John", role: "regular", group: "G1" }
    ];
    const fakeRatings = [];
    fetchUsers.mockResolvedValue(fakeUsers);
    fetchRatings.mockResolvedValue(fakeRatings);

    const createdRating = {
      id: "20",
      name: "John",
      group: "G1",
      subjects: SUBJECTS.reduce((acc, subj) => {
        acc[subj] = { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 };
        return acc;
      }, {})
    };
    createRating.mockResolvedValue(createdRating);

    render(<RatingList />);

    expect(screen.getByText(/Loading ratings…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(createRating).toHaveBeenCalledWith({
        name: "John",
        group: "G1",
        subjects: expect.objectContaining({
          Mathematics: expect.objectContaining({ lab1: 0 }),
          English: expect.objectContaining({ test: 0 })
        })
      });
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("0.00")).toBeInTheDocument();
  });
});
