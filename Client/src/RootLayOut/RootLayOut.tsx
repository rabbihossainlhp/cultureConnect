 import Footer from '../pages/Footer/Footer'
import Navbar from '../pages/navbar/Navbar'
import { Outlet } from 'react-router'

function RootLayOut() {
  return (
    <div>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}

export default RootLayOut