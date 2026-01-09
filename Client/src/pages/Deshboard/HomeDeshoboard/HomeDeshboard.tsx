import Navbar from "../DesNavbar/Navbar"
import StatsSection from "../StatsSection/StatsSection"

 
 
function HomeDeshboard() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="py-7"> <StatsSection></StatsSection></div>
    </div>
  )
}

export default HomeDeshboard