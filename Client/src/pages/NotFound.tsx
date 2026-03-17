import { Link } from "react-router";
import { Compass, Globe2, Home, Users } from "lucide-react";

function NotFound() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-sky-50 flex items-center">
      <section className="max-w-3xl mx-auto w-full rounded-3xl border border-white/80 bg-white/90 p-8 sm:p-10 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)] text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold tracking-wide text-orange-700">
          <Compass className="h-4 w-4" />
          LOST ON THE MAP
        </p>

        <h1 className="mt-4 text-6xl sm:text-7xl font-black text-slate-800">404</h1>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-800">Page Not Found</h2>

        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          This route does not exist or may have been moved. Let’s get you back to exploring cultures and communities.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            to="/"
            className="btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/explore"
            className="btn btn-outline border-sky-300 text-sky-700 hover:bg-sky-50"
          >
            <Globe2 className="h-4 w-4" />
            Explore
          </Link>

          <Link
            to="/community"
            className="btn btn-outline border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Users className="h-4 w-4" />
            Community
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;