import ActiveRooms from "../ActiveRooms/ActiveRooms"
import CommunityActivity from "../CommunityActivity/CommunityActivity"
import CulturalSpotlight from "../CulturalSpotlight/CulturalSpotlight"
import Navbar from "../DesNavbar/Navbar"
import StatsSection from "../StatsSection/StatsSection"
import SuggestedMissions from "../SuggestedMissions/SuggestedMissions"

 
 
function HomeDeshboard() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="p-7">     <StatsSection></StatsSection></div>
          <div  className="pb-7"> <CulturalSpotlight></CulturalSpotlight></div>


          {/* //uniq StatsSection */}
        <div className="md:grid md:grid-cols-6 gap-6 p-6"> 
  {/* Left Section   */}
  <div className="col-span-4">
    <ActiveRooms></ActiveRooms>
   <div className="py-5">
     <SuggestedMissions></SuggestedMissions>
   </div>
  </div>

  {/* Right Section  */}
  <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit">
    <CommunityActivity></CommunityActivity>
      
  </div>
</div>
    </div>
  )
}

export default HomeDeshboard