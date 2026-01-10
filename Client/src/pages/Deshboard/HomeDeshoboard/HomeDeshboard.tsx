import CulturalSpotlight from "../CulturalSpotlight/CulturalSpotlight"
import Navbar from "../DesNavbar/Navbar"
import StatsSection from "../StatsSection/StatsSection"

 
 
function HomeDeshboard() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="p-7">     <StatsSection></StatsSection></div>
          <div  className="pb-7"> <CulturalSpotlight></CulturalSpotlight></div>
    </div>
  )
}

export default HomeDeshboard