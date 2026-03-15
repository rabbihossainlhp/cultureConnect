 import Footer from '../components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import { Outlet } from 'react-router'

function RootLayOut() {
  return (
    <div>
        <Navbar></Navbar>

        <main className='mt-15'>
          <Outlet></Outlet>
        </main>
        
        <Footer></Footer>
    </div>
  )
}

export default RootLayOut