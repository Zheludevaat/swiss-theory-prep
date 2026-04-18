import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "@/store";

const navItems: Array<{ to: string; label: string }> = [
  { to: "/", label: "Today" },
  { to: "/library", label: "Library" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
];

export default function Layout() {
  const status = useStore((s) => s.status);
  const init = useStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="flex min-h-full flex-col">
      <main className="flex-1 overflow-y-auto safe-top">
        {status === "loading" || status === "idle" ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Loading…
          </div>
        ) : status === "error" ? (
          <div className="p-6 text-red-400">
            Failed to load local state. Check browser storage permissions and
            reload.
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <nav className="safe-bottom border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {navItems.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `block py-3 text-center text-xs font-medium ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
