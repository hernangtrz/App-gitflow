import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryCard from "../components/HistoryCard";

describe("HistoryCard", () => {
  test("renderiza sin errores con historial vacío", () => {
    render(<HistoryCard history={[]} />);
    expect(screen.getByText(/últimos 7 días/i)).toBeDefined();
  });
});
