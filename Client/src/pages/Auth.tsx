import { NavLink, Outlet } from "react-router";

export default function Auth() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
        : "text-slate-600 hover:bg-orange-100"
    }`;

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <NavLink to="login" className={tabClass}>
            Login
          </NavLink>
          <NavLink to="signup" className={tabClass}>
            Signup
          </NavLink>
        </div>

        <Outlet />
      </div>
    </section>
  );
}