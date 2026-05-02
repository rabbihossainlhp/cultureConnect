import { FileText, Mail } from "lucide-react";
import { Link } from "react-router";

function TermsOfService() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-sky-50/40 to-white px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
          <FileText className="h-4 w-4" />
          Terms of Service
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Clear terms for a shared community.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          These terms keep CultureConnect safe, respectful, and useful for everyone. By using the app,
          you agree to follow these guidelines.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Use responsibly</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Do not post harmful, abusive, illegal, or misleading content. Respect other users and their cultures.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Accounts and content</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              You are responsible for activity on your account and for content you publish, including posts, comments, and messages.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Service updates</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Features may change over time. We may update the service to improve safety, usability, or performance.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Need help?</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Contact support at reply.cultureconnect@gmail.com if you have questions about these terms.
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

export default TermsOfService;
