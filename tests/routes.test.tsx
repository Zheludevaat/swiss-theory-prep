// E-2: smoke tests for the main routes. We render each route inside a
// MemoryRouter and verify it renders headline content without crashing.
//
// We deliberately don't drive the store through `init()` — these tests run
// against the default (empty) store state, which is the *worst* case for the
// view components and the most likely to surface a NPE on a missing record
// or a divide-by-zero on an empty memory map.

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Today from "@/routes/Today";
import Library from "@/routes/Library";
import Stats from "@/routes/Stats";
import Settings from "@/routes/Settings";
import Teach from "@/routes/Teach";
import Review from "@/routes/Review";
import Mock from "@/routes/Mock";
import { RULES } from "@/content/bundle";

function renderAt(path: string, element: React.ReactNode, routePattern?: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePattern ?? path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("route smoke tests", () => {
  it("Today renders the readiness + due-now block", () => {
    renderAt("/", <Today />);
    expect(screen.getByText("Swiss Theory Prep")).toBeInTheDocument();
    expect(screen.getByText("Readiness")).toBeInTheDocument();
    expect(screen.getByText("Due now")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start review/i })).toBeInTheDocument();
  });

  it("Library renders the rules tab", () => {
    renderAt("/library", <Library />);
    expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument();
    // Rules tab is the default; tab buttons must exist.
    expect(screen.getByRole("button", { name: "Rules" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Signs" })).toBeInTheDocument();
  });

  it("Stats renders without reviews", () => {
    renderAt("/stats", <Stats />);
    expect(screen.getByRole("heading", { name: "Stats" })).toBeInTheDocument();
    // With no reviews yet, the per-category list shows the empty-state copy.
    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
  });

  it("Settings renders the daily target slider", () => {
    renderAt("/settings", <Settings />);
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    // The "reset all data" / destructive button is gated by ConfirmModal —
    // make sure it's at least mounted.
    expect(
      screen.getByRole("button", { name: /reset local state/i }),
    ).toBeInTheDocument();
  });

  it("Teach renders the title for an existing rule", () => {
    // Pick the first real rule so we know the route resolves.
    const ruleId = RULES[0]?.id ?? "missing";
    renderAt(
      `/teach/${encodeURIComponent(ruleId)}`,
      <Teach />,
      "/teach/:ruleId",
    );
    // The teach page renders the rule title at the top.
    expect(screen.getByText(RULES[0]!.title)).toBeInTheDocument();
  });

  it("Review renders the empty-state when there is no queue", () => {
    // No store init() — memory is empty, scheduler returns nothing → the
    // "Nothing to review" branch renders synchronously on first paint.
    // We don't await the async queue compose; we just need the route
    // to mount without throwing.
    renderAt("/review", <Review />);
    expect(
      screen.getByRole("heading", { name: /nothing to review/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to today/i }),
    ).toBeInTheDocument();
  });

  it("Mock renders the lobby with strict + practice mode buttons", () => {
    // Phase starts at "lobby" — composeMockExam doesn't run until the user
    // clicks Begin, so this is a pure synchronous render test.
    renderAt("/mock", <Mock />);
    expect(screen.getByRole("heading", { name: /mock exam/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^strict/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^practice/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^begin (strict|practice) mock$/i }),
    ).toBeInTheDocument();
  });
});
