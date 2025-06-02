    /**
     * @jest-environment jsdom
     */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RatingForm from "./RatingForm";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock("../../api/api", () => ({
  fetchRatingById: jest.fn(),
  updateRating: jest.fn()
}));

import { useParams, useNavigate } from "react-router-dom";
import { fetchRatingById, updateRating } from "../../api/api";

describe("RatingForm", () => {
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders loading and then form with data", async () => {
    useParams.mockReturnValue({ id: "10" });
    const fakeRating = {
      id: "10",
      group: "A-101",
      subjects: {
        Mathematics: { lab1: 5, lab2: 4, lab3: 3, lab4: 2, lab5: 1, test: 10 },
        "Web Programming": { lab1: 1, lab2: 1, lab3: 1, lab4: 1, lab5: 1, test: 5 },
        "Project Management": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        "Computer Networks": { lab1: 2, lab2: 2, lab3: 2, lab4: 2, lab5: 2, test: 5 },
        English: { lab1: 3, lab2: 3, lab3: 3, lab4: 3, lab5: 3, test: 10 }
      }
    };
    fetchRatingById.mockResolvedValue(fakeRating);

    render(<RatingForm />);

    expect(screen.getByText(/Loading form…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/Group:/i)).toHaveValue("A-101");
      const allLab1 = screen.getAllByLabelText(/Lab\s*1/i);
      expect(allLab1[0]).toHaveValue(5);
    });
  });

  it("calls updateRating and navigates after editing and submitting", async () => {
    useParams.mockReturnValue({ id: "10" });
    const fakeRating = {
      id: "10",
      group: "A-101",
      subjects: {
        Mathematics: { lab1: 5, lab2: 4, lab3: 3, lab4: 2, lab5: 1, test: 10 },
        "Web Programming": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        "Project Management": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        "Computer Networks": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        English: { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 }
      }
    };
    fetchRatingById.mockResolvedValue(fakeRating);
    updateRating.mockResolvedValue({ ...fakeRating, group: "B-202" });

    render(<RatingForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Group:/i)).toHaveValue("A-101");
    });

    fireEvent.change(screen.getByLabelText(/Group:/i), {
      target: { value: "B-202" }
    });
    expect(screen.getByLabelText(/Group:/i)).toHaveValue("B-202");

    const lab1Inputs = screen.getAllByLabelText(/Lab\s*1/i);
    fireEvent.change(lab1Inputs[0], { target: { value: "8" } });
    expect(lab1Inputs[0]).toHaveValue(8);

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(updateRating).toHaveBeenCalledWith("10", {
        group: "B-202",
        subjects: expect.objectContaining({
          Mathematics: expect.objectContaining({ lab1: 8 })
        })
      });
      expect(mockNavigate).toHaveBeenCalledWith("/ratings");
    });
  });

  it("navigates to /ratings without calling updateRating on Cancel", async () => {
    useParams.mockReturnValue({ id: "10" });
    const fakeRating = {
      id: "10",
      group: "A-101",
      subjects: {
        Mathematics: { lab1: 5, lab2: 4, lab3: 3, lab4: 2, lab5: 1, test: 10 },
        "Web Programming": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        "Project Management": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        "Computer Networks": { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 },
        English: { lab1: 0, lab2: 0, lab3: 0, lab4: 0, lab5: 0, test: 0 }
      }
    };
    fetchRatingById.mockResolvedValue(fakeRating);

    render(<RatingForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Group:/i)).toHaveValue("A-101");
    });

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(updateRating).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/ratings");
  });
});
