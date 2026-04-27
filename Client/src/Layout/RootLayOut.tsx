 import Footer from '../components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import { Outlet, useLocation } from 'react-router'

function RootLayOut() {
  const location = useLocation()
  const hideFooter = location.pathname.includes('live-rooms')

  return (
    <div>
        <Navbar></Navbar>

        <main className='mt-15'>
          <Outlet></Outlet>
        </main>
        
        {!hideFooter && <Footer></Footer>}
    </div>
  )
}

export default RootLayOut