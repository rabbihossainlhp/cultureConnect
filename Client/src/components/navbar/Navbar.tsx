import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Video, BookOpen, Users, Bell, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar    fixed top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>
      
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          
          <ul className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-64 p-4 shadow-xl border">
            <li><a className="flex items-center gap-3 py-3 text-gray-700 hover:text-orange-500"><Globe size={18} /> Explore Cultures</a></li>
            <li><a className="flex items-center gap-3 py-3 text-gray-700 hover:text-orange-500"><Video size={18} /> Live Rooms</a></li>
            <li><a className="flex items-center gap-3 py-3 text-gray-700 hover:text-orange-500"><BookOpen size={18} /> Missions</a></li>
            <li><a className="flex items-center gap-3 py-3 text-gray-700 hover:text-orange-500"><Users size={18} />
            <NavLink to={"/maindeshboard"}></NavLink>
             Community</a></li>
          </ul>
        </div>
        
        <NavLink to={"/"}>

<a className="btn btn-ghost text-2xl font-bold flex items-center gap-2 hover:bg-transparent">
          <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <Globe className="text-white" size={24} />
          </div>
          <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            CultureConnect
          </span>
        </a>

        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <a className="font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center gap-2">
              <Globe size={18} />
              Explore Cultures
            </a>
          </li>
          
          <li>
            <a className="font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center gap-2">
              <Video size={18} />
              Live Rooms
            </a>
          </li>

          <li>
            <details>
              <summary className="font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center gap-2">
                <BookOpen size={18} />
                Learn
                <ChevronDown size={16} />
              </summary>
              <ul className="p-3 bg-white shadow-xl rounded-box w-56 border mt-2">
                <li><a className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500">🎯 Cultural Missions</a></li>
                <li><a className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500">📚 Language Courses</a></li>
                <li><a className="flex items-center gap-3 py-2 text-gray-700 hover:text-orange-500">🏆 Achievements</a></li>
              </ul>
            </details>
          </li>

          <li>
               <NavLink to={"/maindeshboard"}>
            <a className="font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center gap-2">
              <Users size={18} />
               
              Community
            </a>
               </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-3">
        <button className="btn btn-ghost btn-circle relative">
          <Bell size={22} className="text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <button className="btn btn-ghost font-medium text-gray-700 hover:text-orange-500 hidden sm:inline-flex">
          Sign In
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg hover:shadow-orange-500/30 font-semibold"
        >
          Get Started Free
        </motion.button>
      </div>
    </div>
  );
}

export default Navbar;