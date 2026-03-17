import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BookOpen, ChevronDown, Globe, Menu, Users, Video } from "lucide-react";
import { NavLink, useLocation } from "react-router";

const navItemBase =
  "font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg";
const navItemInactive = "text-gray-700 hover:text-orange-500 hover:bg-orange-50";
const navItemActive = "text-orange-600 bg-orange-50";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const learnMenuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!learnMenuRef.current) return;
      if (!learnMenuRef.current.contains(event.target as Node)) {
        setIsLearnOpen(false);
      }
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLearnOpen(false);
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);


  const closeMenus = () => {
  setIsLearnOpen(false);
  setIsMobileOpen(false);
};

   
  return (
    <header
      className={`navbar fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 lg:px-8 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <button
            type="button"
            className="btn btn-ghost"
            aria-label="Open menu"
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {isMobileOpen && (
            <ul className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-72 p-3 shadow-xl border">
              <li>
                <NavLink onClick={closeMenus} to="/" className={`${navItemBase} ${navItemInactive}`}>
                  <Globe size={18} />
                  Explore Cultures
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeMenus} to="/" className={`${navItemBase} ${navItemInactive}`}>
                  <Video size={18} />
                  Live Rooms
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeMenus} to="/" className={`${navItemBase} ${navItemInactive}`}>
                  <BookOpen size={18} />
                  Missions
                </NavLink>
              </li>
              <li>
                <NavLink onClick={closeMenus}
                  to="/community"
                  className={({ isActive }) =>
                    `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
                  }
                >
                  <Users size={18} />
                  Community
                </NavLink>
              </li>
              <li className="mt-1">
                <NavLink onClick={closeMenus} to="/auth/login" className="btn btn-ghost justify-start">
                  Sign In
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        <NavLink  onClick={closeMenus}
          to="/"
          className="btn btn-ghost text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 hover:bg-transparent"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <Globe className="text-white" size={22} />
          </div>
          <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            CultureConnect
          </span>
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <NavLink onClick={closeMenus} to="/" className={`${navItemBase} ${navItemInactive}`}>
              <Globe size={18} />
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink  onClick={closeMenus}to="/" className={`${navItemBase} ${navItemInactive}`}>
              <Video size={18} />
              Live Rooms
            </NavLink>
          </li>

          <li ref={learnMenuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isLearnOpen}
              onClick={() => setIsLearnOpen((prev) => !prev)}
              className={`${navItemBase} ${navItemInactive} select-none`}
            >
              <BookOpen size={18} />
              Learn
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isLearnOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isLearnOpen && (
              <ul
                role="menu"
                className="absolute left-0 top-full mt-2 w-56 rounded-xl border bg-white p-2 shadow-xl z-50"
              >
                <li>
                  <NavLink onClick={closeMenus}
                    to="/learn/missions"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Cultural Missions
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={closeMenus}
                    to="/learn/languages"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Language Courses
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={closeMenus}
                    to="/learn/achievements"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Achievements
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink onClick={closeMenus}
              to="/community"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              <Users size={18} />
              Community
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2 sm:gap-3">
        <button className="btn btn-ghost btn-circle relative" aria-label="Notifications">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <NavLink onClick={closeMenus}
          to="/auth/login"
          className="btn btn-ghost font-medium text-gray-700 hover:text-orange-500 hidden sm:inline-flex"
        >
          Sign In
        </NavLink>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg hover:shadow-orange-500/30 font-semibold"
        >
          Get Started
        </motion.button>
      </div>
    </header>
  );
}

export default Navbar;