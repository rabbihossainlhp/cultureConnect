import { useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import { Outlet } from 'react-router'
import Footer from '../components/Footer/Footer'

export default function DashboardLayout() {
  useEffect(() => {
    document.title = 'Dashboard | CultureConnect'
  }, [])

  return (
    <div>
        <Navbar/>

        <Outlet></Outlet>

        <Footer/>
    </div>
  )
}
