import React from 'react';
import { Video, BookOpen, Globe } from 'lucide-react';

// 1. Define the Interface for the Action items
interface ActionItem {
  id: number;
  label: string;
  icon: React.ElementType;
}

const actions: ActionItem[] = [
  { id: 1, label: "Join a Room", icon: Video },
  { id: 2, label: "Browse Missions", icon: BookOpen },
  { id: 3, label: "Practice Language", icon: Globe },
];

function QuickActions() {
  return (
    <div className="w-full">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      {/* Actions Stack */}
      <div className="flex flex-col space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex items-center space-x-4 w-full p-4 border-2 border-[#5a8bb8] rounded-2xl text-[#5a8bb8] hover:bg-blue-50 transition-all duration-200 group"
          >
            {/* Icon */}
            <action.icon 
              size={24} 
              strokeWidth={1.5} 
              className="group-hover:scale-110 transition-transform" 
            />
            
            {/* Label */}
            <span className="text-lg font-semibold text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;