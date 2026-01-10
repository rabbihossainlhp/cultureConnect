import { useState, useEffect } from 'react';
 import { Globe } from 'lucide-react';
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
    <div className={`fixed top-0 z-50 w-full h-48 flex justify-between items-center text-white transition-all duration-300 py-12 static ${
  isScrolled 
    ? 'bg-white shadow-lg' 
    : 'bg-linear-to-r from-[#4a78a0] via-[#85b1ad] to-[#b8e3b5] backdrop-blur-md shadow-sm'
}`}>
      
   

      <div className="navbar-center hidden lg:flex px-4 text-white">
        <ul className="   px-1 gap-2">
 
          <li>
                
            <a className="font-medium   hover:text-orange-50 hover:bg-orange-50 transition-colors   items-center gap-2">
                <h1 className='font-bold text-xl md:text-2xl lg:text-4xl '> <br />
                    Welcome back, Alex!
                </h1>
            
               <p>
                Ready to connect with the world today?
               </p>
              
            </a>
   
          </li>
        </ul>
      </div>

        <div className="navbar-start ">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          
        
        </div>
        
        <NavLink to={"/"}>

<a className="btn btn-ghost text-2xl font-bold flex items-center gap-2 hover:bg-transparent">
          <div className="  bg-linear-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <Globe className="text-white" size={100} />
          </div>
          {/* <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            CultureConnect
          </span> */}
        </a>

        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;