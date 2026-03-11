 
 import { CalendarDays } from 'lucide-react';

function CulturalSpotlight() {
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-[#E8B576]/30 bg-gradient-to-r from-[#FDF4E7] to-[#F3F8F4] shadow-sm">
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="p-3 bg-[#E8B576] rounded-full flex-shrink-0">
          <CalendarDays className="w-6 h-6 text-gray-800" strokeWidth={2} />
        </div>
        
        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            Today's <span className="bg-gray-200/80 px-1">Cultural Spotlight</span>: Diwali Festival
          </h3>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Learn about the Indian Festival of Lights celebrated by millions worldwide. Join our special room at 3 PM EST.
          </p>
        </div>
      </div>
      
      {/* Button */}
      <div className="mt-6">
        <button className="px-6 py-2.5 bg-[#E8B576] text-gray-800 font-semibold rounded-full hover:bg-[#dbaa6b] transition-colors duration-200 shadow-sm">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default CulturalSpotlight;