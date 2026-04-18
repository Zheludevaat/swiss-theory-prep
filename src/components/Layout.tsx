import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "@/store";

const navItems: Array<{ to: string; label: string; match?: (path: string) => boolean }> = [
  {
    to: "/",
    label: "Today",
    // D-16: Today highlights while the user is inside a review/teach flow, since
    // those are entered from Today and return there. Without this the bottom
    // nav looks "orphaned" — no item appears active on those routes.
    match: (p) => p === "/" || p.startsWith("/review") || p.startsWith("/teach"),
  },
  { to: "/library", label: "Library" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
];

export default function Layout() {
  const status = useStore((s) => s.status);
  const init = useStore((s) => s.init);
  const location = useLocation();

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="flex min-h-full flex-col">
      <main className="flex-1 overflow-y-auto safe-top">
        {status === "loading" || status === "idle" ? (
          <TodaySkeleton />
        ) : status === "error" ? (
          <div className="mx-auto max-w-lg space-y-3 p-6">
            <h1 className="text-xl font-semibold text-red-300">
              Couldn't load local state
            </h1>
            <p className="text-sm text-slate-400">
              The app's local database wouldn't open. This is usually a
              temporary browser storage hiccup (private mode, full disk,
              permission prompt).
            </p>
            <button
              type="button"
              onClick={() => void init()}
              className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm"
            >
              Reload app
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <nav
        className="safe-bottom border-t border-slate-800 bg-slate-900/95 backdrop-blur"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {navItems.map((n) => {
            const pathIsActive = n.match
              ? n.match(location.pathname)
              : location.pathname === n.to ||
                location.pathname.startsWith(`${n.to}/`);
            return (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === "/"}
                  aria-current={pathIsActive ? "page" : undefined}
                  className={`block py-3 text-center text-xs font-medium ${
                    pathIsActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  {n.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/**
 * D-11: skeleton loading state. Mirrors Today's visual weight (readiness +
 * big "start review" block + last-session footer) so the shell doesn't jump
 * when real content arrives. Plain "Loading…" text was jarring — the app
 * briefly looked broken on every cold boot.
 */
function TodaySkeleton() {
  return (
    <div
      className="mx-auto max-w-lg space-y-4 p-4"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-8 w-2/3 skeleton" />
      <div className="h-4 w-1/3 skeleton" />
      <div className="skeleton h-20" />
      <div className="skeleton h-44" />
      <div className="skeleton h-16" />
    </div>
  );
}
