import { useEffect } from 'react'
import Footer from '../components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import { Outlet, useLocation } from 'react-router'
import { loadGoogleAnalytics, trackPageView } from '../utils/analytics'

function RootLayOut() {
  const location = useLocation()
  const hideFooter = location.pathname.includes('live-rooms')

  useEffect(() => {
    loadGoogleAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main>
          <Outlet />
        </main>
        
        {!hideFooter && <Footer />}
    </div>
  )
}

export default RootLayOut