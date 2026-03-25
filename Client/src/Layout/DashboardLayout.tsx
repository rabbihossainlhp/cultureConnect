import Navbar from '../components/navbar/Navbar'
import { Outlet } from 'react-router'
import Footer from '../components/Footer/Footer'

export default function DashboardLayout() {
  return (
    <div>
        <Navbar/>

        <Outlet></Outlet>

        <Footer/>
    </div>
  )
}
