import React from 'react';
import { Video, Users } from 'lucide-react';


// 1. Define the Interface for the Room data
interface Room {
  id: number;
  title: string;
  tag: string;
  category: string;
  users: number;
}

// 2. Define the Props for the RoomCard component
interface RoomCardProps {
  room: Room;
}

const roomsData: Room[] = [
  {
    id: 1,
    title: 'Spanish Conversation',
    tag: 'Spanish',
    category: 'Food & Culture',
    users: 12,
  },
  {
    id: 2,
    title: 'Japanese Learning Circle',
    tag: 'Japanese',
    category: 'Anime & Manga',
    users: 8,
  },
  {
    id: 3,
    title: 'French Storytelling',
    tag: 'French',
    category: 'Literature',
    users: 15,
  },
  
];

const RoomCard: React.FC<RoomCardProps> = ({ room }) => (
  <div className="  rounded-2xl p-4 flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    {/* Left Section: Icon and Text */}
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full text-blue-600">
        <Video size={24} strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-lg">{room.title}</h3>
        <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
            {room.tag}
          </span>
          <span>&bull;</span>
          <span>{room.category}</span>
        </div>
      </div>
    </div>

    {/* Right Section: User Count and Button */}
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center text-gray-500 text-sm space-x-1 font-medium">
        <Users size={16} />
        <span>{room.users}</span>
      </div>
      <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
        Join
      </button>
    </div>
  </div>
);

function ActiveRooms() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Rooms</h2>
          <a href="#" className="text-blue-600 font-medium hover:underline">
            View All
          </a>
        </div>

        {/* Room List */}
        <div className="flex flex-col space-y-4">
          {roomsData.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActiveRooms;