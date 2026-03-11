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
      <div className="w-full max-w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">
          Suggested Missions
        </h2>
        <button className="text-sm md:text-base text-[#5a8bb8] font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* Mission List */}
      <div className="flex flex-col gap-3 md:gap-4">
        {missionsData.map((mission) => (
          <div 
            key={mission.id} 
            className="
              bg-white rounded-2xl md:rounded-[2rem]
              p-[4%] md:p-5
              flex flex-col md:flex-row
              items-start md:items-center
              justify-between
              gap-4
              shadow-sm border border-gray-100
              hover:shadow-md transition
              w-full
            "
          >
            {/* Left Section */}
            <div className="flex items-start md:items-center gap-4 w-full md:w-[75%]">
              
              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
                <BookOpen size={24} className="md:size-[28px]" />
              </div>

              {/* Text */}
              <div className="w-full">
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
                  {mission.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs md:text-sm font-medium">
                    {mission.category}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${getDifficultyStyles(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>

                  <span className="text-gray-400 text-xs md:text-sm font-medium">
                    {mission.points} points
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="w-full md:w-[20%] flex md:justify-end">
              <button className="
                w-full md:w-auto
                px-6 py-2.5
                text-sm md:text-base
                bg-[#5a8bb8] text-white font-bold
                rounded-full
                hover:bg-[#4a78a0]
                transition shadow-sm
              ">
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

export default SuggestedMissions;