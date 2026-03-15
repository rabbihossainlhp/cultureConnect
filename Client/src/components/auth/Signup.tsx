import React from "react";
import { Globe2, Languages, Mail, UserRound } from "lucide-react";
import { Link } from "react-router";

const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Japan",
];

const nativeLanguages = [
  "Bangla",
  "English",
  "Hindi",
  "Urdu",
  "Nepali",
  "Tamil",
  "Arabic",
  "Spanish",
  "French",
  "Japanese",
];

export default function Signup() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <aside className="hidden lg:block">
          <h1 className="text-4xl font-black leading-tight text-slate-800">
            Meet the world,
            <br />
            one culture at a time.
          </h1>
          <p className="mt-3 max-w-md text-slate-600">
            Join CultureConnect and build meaningful cross-cultural friendships.
          </p>
        </aside>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.4)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">Create Your Account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start your journey with people from different cultures
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Username
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                  <UserRound className="h-4 w-4 text-orange-500" />
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </label>

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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Country
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Globe2 className="h-4 w-4 text-orange-500" />
                  <select className="w-full bg-transparent text-sm text-slate-800 focus:outline-none">
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Native Language
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Languages className="h-4 w-4 text-orange-500" />
                  <select className="w-full bg-transparent text-sm text-slate-800 focus:outline-none">
                    <option value="">Select language</option>
                    {nativeLanguages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300" />
              I agree to the Terms and Privacy Policy.
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-semibold text-pink-600 hover:text-pink-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}