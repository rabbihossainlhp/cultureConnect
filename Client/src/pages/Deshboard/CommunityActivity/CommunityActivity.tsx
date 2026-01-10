 
// 1. Updated Interface to match the image content
interface Activity {
  id: number;
  initials: string;
  name: string;
  action: string; // e.g., "completed mission" or "joined room"
  activity: string; // e.g., "Brazilian Carnival Traditions"
  time: string;
  gradient: string; // To handle the different avatar colors
}

const activityData: Activity[] = [
  {
    id: 1,
    initials: "MS",
    name: "Maria Santos",
    action: "completed mission",
    activity: "Brazilian Carnival Traditions",
    time: "2 hours ago",
    gradient: "bg-linear-to-br from-slate-400 to-amber-200",
  },
  {
    id: 2,
    initials: "YT",
    name: "Yuki Tanaka",
    action: "joined room",
    activity: "Japanese Tea Ceremony",
    time: "3 hours ago",
    gradient: "bg-linear-to-br from-slate-500 to-orange-200",
  },
    {
    id: 3,
    initials: "xT",
    name: "Yuki Tanaka",
    action: "joined room",
    activity: "Japanese Tea Ceremony",
    time: "6 hours ago",
    gradient: "bg-linear-to-br from-slate-500 to-orange-200",
  },
];

function CommunityActivity() {
  return (
    <div className="w-full">
      {/* Heading matches the style of "Active Rooms" */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Activity</h2>

      {/* Main Container Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col">
          {activityData.map((item, index) => (
            <div 
              key={item.id}  
              className={`flex items-start space-x-4 py-5 ${
                index !== activityData.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Avatar with dynamic gradient */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${item.gradient}`}>
                {item.initials}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <p className="text-[15px] leading-snug">
                  <span className="font-bold text-gray-900">{item.name}</span>{" "}
                  <span className="text-gray-400 font-medium">{item.action}</span>{" "}
                  <span className="font-bold text-gray-900">{item.activity}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityActivity;