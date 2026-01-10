 import { BookOpen } from 'lucide-react';

// 1. Define the Mission Interface
interface Mission {
  id: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

const missionsData: Mission[] = [
  {
    id: 1,
    title: "Cook a Traditional Dish",
    category: "Italian",
    difficulty: "Medium",
    points: 150,
  },
  {
    id: 2,
    title: "Learn a Folk Song",
    category: "Mexican",
    difficulty: "Easy",
    points: 100,
  },
  {
    id: 3,
    title: "Traditional Art Practice",
    category: "Japanese",
    difficulty: "Hard",
    points: 200,
  },
];

// Helper to handle dynamic difficulty colors
const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-emerald-100 text-emerald-700';
    case 'Medium':
      return 'bg-[#E8B576]/30 text-[#8B5E3C]'; // Matches the tan/orange in your image
    case 'Hard':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

function SuggestedMissions() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Suggested Missions</h2>
        <button className="text-[#5a8bb8] font-semibold hover:underline">View All</button>
      </div>

      {/* Mission List */}
      <div className="flex flex-col space-y-4">
        {missionsData.map((mission) => (
          <div 
            key={mission.id} 
            className="bg-white rounded-[2rem] p-5 flex items-center justify-between shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-200"
          >
            {/* Left Section: Icon & Content */}
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500/80">
                <BookOpen size={28} strokeWidth={1.5} />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{mission.title}</h3>
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                    {mission.category}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${getDifficultyStyles(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    {mission.points} points
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Button */}
            <button className="px-8 py-2.5 bg-[#5a8bb8] text-white font-bold rounded-full hover:bg-[#4a78a0] transition-colors shadow-sm">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedMissions;