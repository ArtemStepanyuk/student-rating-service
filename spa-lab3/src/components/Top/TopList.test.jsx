/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopList from "./TopList";

jest.mock("../../api/api", () => ({
  fetchRatings: jest.fn()
}));

import { fetchRatings } from "../../api/api";

describe("TopList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows Loading, then a message if no eligible students", async () => {
    const lowRatings = [
      {
        id: "1",
        name: "Ivan",
        subjects: {
          Math: { lab1: 1, lab2: 1, lab3: 1, lab4: 1, lab5: 1, test: 1 },
          English: { lab1: 1, lab2: 1, lab3: 1, lab4: 1, lab5: 1, test: 1 }
        }
      },
      {
        id: "2",
        name: "Peter",
        subjects: {
          Math: { lab1: 2, lab2: 2, lab3: 2, lab4: 2, lab5: 2, test: 2 },
          English: { lab1: 2, lab2: 2, lab3: 2, lab4: 2, lab5: 2, test: 2 }
        }
      }
    ];
    fetchRatings.mockResolvedValue(lowRatings);

    render(<TopList />);

    expect(screen.getByText(/Loading top students…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/No students with average ≥ 85\./i)).toBeInTheDocument();
    });
  });

  it("displays only students with avg ≥ 85", async () => {
    const ratings = [
      {
        id: "1",
        name: "Ivan",
        subjects: {
          Math: { lab1: 10, lab2: 10, lab3: 10, lab4: 10, lab5: 10, test: 40 },
          English: { lab1: 10, lab2: 10, lab3: 10, lab4: 10, lab5: 10, test: 40 }
        }
      },
      {
        id: "2",
        name: "Peter",
        subjects: {
          Math: { lab1: 1, lab2: 1, lab3: 1, lab4: 1, lab5: 1, test: 1 },
          English: { lab1: 2, lab2: 2, lab3: 2, lab4: 2, lab5: 2, test: 2 }
        }
      }
    ];
    fetchRatings.mockResolvedValue(ratings);

    render(<TopList />);

    expect(screen.getByText(/Loading top students…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/Top Students/i);
      expect(screen.getByText("Ivan — 90")).toBeInTheDocument();
      expect(screen.queryByText(/Peter/)).not.toBeInTheDocument();
    });
  });
});
