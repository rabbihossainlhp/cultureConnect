import { NavLink, Outlet } from "react-router";
import BrandMark from "../components/common/BrandMark";

export default function Auth() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `cc-btn px-4 py-2 text-sm ${
      isActive
        ? "cc-btn-primary"
        : "cc-btn-ghost"
    }`;

  return (
    <section className="min-h-screen bg-linear-to-b from-orange-50 via-slate-50 to-cyan-50 px-4 py-8 cc-page-offset">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-center">
          <BrandMark imageClassName="h-12 w-12" textClassName="text-xl font-extrabold tracking-tight text-slate-900" />
        </div>

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