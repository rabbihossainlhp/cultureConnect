 import Footer from '../components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import { Outlet, useLocation } from 'react-router'

function RootLayOut() {
  const location = useLocation()
  const hideFooter = location.pathname.includes('live-rooms')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main className="pt-20 sm:pt-24">
          <Outlet />
        </main>
        
        {!hideFooter && <Footer />}
    </div>
  )
}

export default RootLayOut