import { NavLink, Outlet } from 'react-router';    
import { BiHome, BiMenu } from 'react-icons/bi';
import { SiCultura } from 'react-icons/si';
import { FaRegFileAlt } from 'react-icons/fa';
 
function MainDeshboard() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-gray-500">
        {/* Mobile Navbar */}
        <div className="navbar bg-white shadow-sm w-full lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-ghost btn-square text-blue-600">
              <BiMenu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-semibold text-gray-700">Dashboard</div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-200">
          <Outlet />
           
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="menu bg-gradient-to-b from-white-800 to-white-900 text-black min-h-full w-80 p-0">
          {/* Logo Section */}
          <div className="p-6 border-b border-blue-500">
            <SiCultura  />
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/"
                  className={({isActive}) => 
                    `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-blue-500/30'}`
                  }
                >
                  <BiHome className="w-5 h-5 mr-3" />
                  <span className="font-medium">Home</span>
                </NavLink>
              </li>
 
              <li>
                <NavLink 
                  to="/maindeshboard/homedeshboard"
                  className={({isActive}) => 
                    `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-blue-500/30'}`
                  }
                >
                  <FaRegFileAlt className="w-5 h-5 mr-3" />
                  <span className="font-medium">Deshboard</span>
                </NavLink>
              </li>

              
            </ul>
          </nav>

          
        </aside>
      </div>
    </div>
  );
}

export default MainDeshboard;