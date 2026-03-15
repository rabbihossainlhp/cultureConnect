import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-orange-100 bg-gradient-to-b from-white to-orange-50">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
                CultureConnect
              </h2>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Connecting people through culture, language, and shared stories.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-orange-600">
                  Community
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600">
                  Live Rooms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600">
                  Cultural Missions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-orange-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                hello@cultureconnect.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                +880 1234-567890
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Dhaka, Bangladesh
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white transition hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-orange-100 pt-5 text-sm text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} CultureConnect. All rights reserved.</p>
          <p>Made for global connection and cultural learning.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;