
import React from "react";
import { Eye, EyeOff, Lock, Mail, Globe } from "lucide-react";
import { Link } from "react-router";

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 rounded-full bg-pink-300/35 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-xs font-semibold tracking-widest text-orange-600">
            <Globe className="h-4 w-4" />
            CULTURECONNECT
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-800">
            Welcome Back
          </h1>
          <p className="mt-3 max-w-md text-slate-600">
            Rejoin your global community, continue cultural conversations, and
            explore new stories from around the world.
          </p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(236,72,153,0.35)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">Sign In</h2>
            <p className="mt-1 text-sm text-slate-500">
              Access your CultureConnect account
            </p>
          </div>

          <form className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                <Mail className="h-4 w-4 text-orange-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                <Lock className="h-4 w-4 text-orange-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a href="#" className="font-medium text-pink-600 hover:text-pink-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              Sign In
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here?{" "}
            <Link to="/auth/signup" className="font-semibold text-orange-600 hover:text-orange-500">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}