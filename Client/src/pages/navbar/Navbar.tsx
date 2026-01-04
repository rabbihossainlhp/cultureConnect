import { NavLink } from "react-router"

 

 
function Navbar() {


  const NavItems =(
    <>
    <NavLink
      to="/"
      className={({ isActive }) =>
        `relative px-4 py-2 font-medium transition-all duration-300 ${
          isActive
            ? "text-primary"
            : "text-gray-600 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          Home
          {isActive && (
            <span className="absolute left-1/2 -bottom-1 w-2/3 h-0.5 bg-primary transform -translate-x-1/2 rounded-full transition-all duration-300" />
          )}
          {!isActive && (
            <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-primary transform -translate-x-1/2 rounded-full group-hover:w-2/3 transition-all duration-300" />
          )}
        </>
      )}
    </NavLink>


        <NavLink
      to="/about"
      className={({ isActive }) =>
        `relative px-4 py-2 font-medium transition-all duration-300 ${
          isActive
            ? "text-primary"
            : "text-gray-600 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          About
          {isActive && (
            <span className="absolute left-1/2 -bottom-1 w-2/3 h-0.5 bg-primary transform -translate-x-1/2 rounded-full transition-all duration-300" />
          )}
          {!isActive && (
            <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-primary transform -translate-x-1/2 rounded-full group-hover:w-2/3 transition-all duration-300" />
          )}
        </>
      )}
    </NavLink>
    
    </>
  )


  return (
   <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        // tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          {NavItems}
        </li>
         
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">CultureConnect</a>
  </div>
  <div className="navbar-center hidden lg:flex gap-6">
    <ul className="menu menu-horizontal px-1 ">
      <li className=""><a>
        {NavItems}
        </a></li>
       
    </ul>
  </div>
  <div className="navbar-end space-x-2">
    <a className="btn">login</a>
    <a className="btn">register</a>
  </div>
</div>
  )
}

export default Navbar