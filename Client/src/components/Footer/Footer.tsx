import { Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import BrandMark from "../common/BrandMark";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <BrandMark
              imageClassName="h-11 w-11"
              textClassName="text-xl font-extrabold tracking-tight text-slate-900"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              A focused space for sharing culture, discovering people, and learning across languages.
            </p>
            <a
              href="mailto:reply.cultureconnect@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              <Mail className="h-4 w-4" />
              reply.cultureconnect@gmail.com
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Quick Links</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li><Link to="/" className="hover:text-orange-600">Home</Link></li>
                <li><Link to="/explore" className="hover:text-orange-600">Explore</Link></li>
                <li><Link to="/community" className="hover:text-orange-600">Community</Link></li>
                <li><Link to="/live-rooms" className="hover:text-orange-600">Live Rooms</Link></li>
                <li><Link to="/profile" className="hover:text-orange-600">Profile</Link></li>
                <li><Link to="/learn/missions" className="hover:text-orange-600">Missions</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li><Link to="/privacy-policy" className="hover:text-orange-600">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-orange-600">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Contact</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Use the support email for account help, content questions, and community requests.
              </p>
              <a
                href="mailto:reply.cultureconnect@gmail.com?subject=CultureConnect%20Support"
                className="mt-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
          © {new Date().getFullYear()} CultureConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;