import { useEffect } from 'react'
import Footer from '../components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import { Outlet, useLocation } from 'react-router'
import { loadGoogleAnalytics, trackPageView } from '../utils/analytics'

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Home | CultureConnect'
  if (pathname.startsWith('/explore/')) return 'Explore Post | CultureConnect'
  if (pathname === '/explore') return 'Explore | CultureConnect'
  if (pathname === '/community') return 'Community | CultureConnect'
  if (pathname === '/live-rooms') return 'Live Rooms | CultureConnect'
  if (pathname === '/profile') return 'Profile | CultureConnect'
  if (pathname === '/privacy-policy') return 'Privacy Policy | CultureConnect'
  if (pathname === '/terms-of-service') return 'Terms of Service | CultureConnect'
  if (pathname === '/verify-email') return 'Verify Email | CultureConnect'
  if (pathname === '/learn/missions') return 'Missions | CultureConnect'
  if (pathname === '/learn/languages') return 'Languages | CultureConnect'
  if (pathname === '/auth/login') return 'Login | CultureConnect'
  if (pathname === '/auth/signup') return 'Signup | CultureConnect'

  return 'CultureConnect'
}

function RootLayOut() {
  const location = useLocation()
  const hideFooter = location.pathname.includes('live-rooms')

  useEffect(() => {
    loadGoogleAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

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