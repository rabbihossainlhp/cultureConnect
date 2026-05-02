import { ShieldCheck, Mail } from "lucide-react";
import { Link } from "react-router";

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-orange-50/40 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
          <ShieldCheck className="h-4 w-4" />
          Privacy Policy
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Your privacy, kept simple.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          CultureConnect is designed to help people share culture and connect responsibly.
          This page explains what we collect, how we use it, and how to reach us if you need help.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">What we collect</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              We may store basic account details, profile information, posts, comments, messages,
              and app activity needed to run features like communities and live rooms.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">How we use it</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Data is used to show your profile, keep conversations working, store content, and improve the experience.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Sharing</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              We do not sell personal data. Shared content may be visible to other users depending on the feature you use.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Contact</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              For privacy questions, email us at reply.cultureconnect@gmail.com.
            </p>
            <a href="mailto:reply.cultureconnect@gmail.com" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
              <Mail className="h-4 w-4" />
              reply.cultureconnect@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          <Link to="/" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
