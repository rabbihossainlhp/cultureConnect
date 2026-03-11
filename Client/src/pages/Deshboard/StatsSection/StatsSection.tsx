 import { Users, Award, TrendingUp, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      label: "Connections",
      value: "47",
      icon: <Users className="text-blue-500/70" size={32} strokeWidth={1.5} />,
    },
    {
      label: "Badges Earned",
      value: "12",
      icon: <Award className="text-orange-300" size={32} strokeWidth={1.5} />,
    },
    {
      label: "Total Points",
      value: "850",
      icon: <TrendingUp className="text-emerald-400/80" size={32} strokeWidth={1.5} />,
    },
    {
      label: "Languages",
      value: "8",
      icon: <Globe className="text-blue-600/60" size={32} strokeWidth={1.5} />,
    },
    
  ];

  return (
    <div className="   pb-0   flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300"
          >
            <div className="mb-4">
              {item.icon}
            </div>
            <h2 className="text-4xl font-semibold text-gray-800 mb-1">
              {item.value}
            </h2>
            <p className="text-gray-500 font-medium text-sm tracking-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;