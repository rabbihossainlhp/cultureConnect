import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { Send, Users } from "lucide-react";
import type { Message, RoomUser } from "../../constants/interface";


const HARDCODED_ROOMS = [
  { id: "room-1", name: "🇯🇵 Japan Culture Hub", language: "Japanese", members: 0 },
  { id: "room-2", name: "🇸🇵 Spanish Learners", language: "Spanish", members: 0 },
  { id: "room-3", name: "🇮🇳 Indian Traditions", language: "Hindi", members: 0 },
  { id: "room-4", name: "🇫🇷 Paris International", language: "French", members: 0 },
  { id: "room-5", name: "🌍 Global Explorers", language: "English", members: 0 },
];


function LiveRooms() {
  const { user } = useAuth();


  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(HARDCODED_ROOMS[0]?.id || null);

  // Messages in current room
  const [messages, setMessages] = useState<Message[]>([]);

  // Users currently in the room
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);

  // Input field value
  const [messageInput, setMessageInput] = useState("");

  // Are we connected to socket server?
  const [isConnected, setIsConnected] = useState(false);

  // Socket connection instance (useRef to avoid setState cascading)
  const socketRef = useRef<Socket | null>(null);

  // ===== SOCKET.IO SETUP =====
  // Line 72: This runs once on component mount
  useEffect(() => {
    // Line 75: Create socket connection
    const newSocket = io("http://localhost:4713/", {
      withCredentials: true,
    });

    // ===== CONNECTION LISTENERS =====

    // Line 81: When socket connects successfully
    newSocket.on("connect", () => {
      console.log(" Socket connected:", newSocket.id);
      setIsConnected(true);

      // Line 86: Join the default room (room-1)
      if (selectedRoomId) {
        newSocket.emit("room:join", selectedRoomId, {
          userId: user?.email,
          username: user?.username,
          country: user?.country,
        });
      }
    });

    // Line 95: When we successfully join a room
    newSocket.on("room:joined", (data) => {
      console.log(" Joined:", data.message);
      // Line 98: Clear messages when switching rooms
      setMessages([]);
      setRoomUsers([]);
    });

    // Line 102: When ANOTHER user joins our current room (broadcast)
    newSocket.on("room:user_joined", (userData: RoomUser) => {
      console.log(` ${userData.username} joined!`);
      
      // Line 106: Add this user to our roomUsers list
      setRoomUsers((prev) => {
        // Line 108: Don't add duplicate if they're already there
        const exists = prev.find((u) => u.userId === userData.userId);
        if (exists) return prev;
        return [...prev, userData];
      });
    });

    // Line 114: When a user leaves the room
    newSocket.on("room:user_left", (userData: RoomUser) => {
      console.log(` ${userData.username} left!`);
      
      // Line 118: Remove them from roomUsers list
      setRoomUsers((prev) => prev.filter((u) => u.userId !== userData.userId));
    });

    // Line 122: When a new message arrives in the room
    newSocket.on("chat:new", (messageData: Message) => {
      console.log(` ${messageData.username}: ${messageData.text}`);
      
      // Line 126: Add message to our messages list
      setMessages((prev) => [...prev, messageData]);
    });

    // Line 130: When socket disconnects
    newSocket.on("disconnect", (reason) => {
      console.log(" Socket disconnected:", reason);
      setIsConnected(false);
    });

    // Line 135: Save socket to ref (not state, to avoid cascading renders)
    socketRef.current = newSocket;

    // Line 138: Cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [user]); // Re-run if user object changes

  // ===== ROOM CHANGE HANDLER =====
  // Line 145: When user clicks a different room
  const handleRoomChange = (roomId: string) => {
    const socket = socketRef.current;
    // Line 148: Leave current room first
    if (selectedRoomId && socket) {
      socket.emit("room:leave", selectedRoomId, {
        userId: user?.email,
        username: user?.username,
      });
    }

    // Line 155: Update selected room
    setSelectedRoomId(roomId);

    // Line 158: Join the new room
    if (socket) {
      socket.emit("room:join", roomId, {
        userId: user?.email,
        username: user?.username,
        country: user?.country,
      });
    }
  };

  // ===== MESSAGE SEND HANDLER =====
  // Line 169: When user types and clicks send
  const handleSendMessage = () => {
    const socket = socketRef.current;
    // Line 172: Check message isn't empty
    if (!messageInput.trim() || !socket || !selectedRoomId) return;

    // Line 175: Send message to backend
    socket.emit("chat:send", selectedRoomId, {
      userId: user?.email,
      username: user?.username,
      text: messageInput,
      timestamp: new Date().toISOString(),
    });

    // Line 182: Clear input field
    setMessageInput("");
  };

  // ===== JSX: THE UI =====
  return (
    <section className="flex h-[calc(100vh-88px)] bg-slate-50">
      {/* ===== LEFT SIDEBAR: ROOM LIST ===== */}
      {/* Line 190: Rooms list column */}
      <aside className="w-full sm:w-64 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
        {/* Line 193: Header */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Live Rooms</h2>
          <p className="text-xs text-slate-500 mt-1">
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </p>
        </div>

        {/* Line 201: Rooms list */}
        <div className="flex-1 overflow-y-auto">
          {HARDCODED_ROOMS.map((room) => (
            <button
              // Line 206: Click handler to switch rooms
              onClick={() => handleRoomChange(room.id)}
              // Line 208: Highlight selected room
              className={`w-full text-left px-4 py-3 border-l-4 transition ${
                selectedRoomId === room.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-transparent hover:bg-slate-50"
              }`}
              key={room.id}
            >
              {/* Room name and icon */}
              <p className="font-semibold text-sm text-slate-800">{room.name}</p>
              
              {/* Room language and member count */}
              <p className="text-xs text-slate-500 mt-1">
                {room.language} • {roomUsers.length} online
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* ===== RIGHT COLUMN: CHAT AREA ===== */}
      {/* Line 232: Main chat content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* LINE 234: HEADER WITH ROOM INFO */}
        {selectedRoomId && (
          <div className="p-4 border-b border-slate-200 bg-white">
            <h1 className="font-bold text-lg text-slate-800">
              {HARDCODED_ROOMS.find((r) => r.id === selectedRoomId)?.name}
            </h1>
            {/* Line 241: Show users count */}
            <p className="text-sm text-slate-600 mt-1">
              {roomUsers.length} people online
            </p>
          </div>
        )}

        {/* LINE 247: MESSAGES AREA */}
        {/* Line 248: Scrollable message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            // Line 251: Empty state
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>No messages yet. Say hello! </p>
            </div>
          ) : (
            // Line 256: Show all messages
            messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col">
                {/* Username and time */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">
                    {msg.username}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {/* Message text */}
                <p className="text-sm text-slate-700 mt-1 bg-white rounded-lg p-3 inline-block max-w-xs">
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* LINE 279: USERS SECTION */}
        {/* Line 280: Show who's in this room */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 max-h-32 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            <Users className="inline h-3 w-3 mr-1" />
            People Online ({roomUsers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {roomUsers.map((roomUser) => (
              <span
                key={roomUser.userId}
                className="text-xs bg-white px-2 py-1 rounded-full border border-slate-200"
              >
                {roomUser.username} 🌍 {roomUser.country}
              </span>
            ))}
          </div>
        </div>

        {/* LINE 299: MESSAGE INPUT AREA */}
        {/* Line 300: Send message form */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            {/* Text input */}
            <input
              // Line 305: Update state as user types
              onChange={(e) => setMessageInput(e.target.value)}
              // Line 307: Value from state
              value={messageInput}
              // Line 309: Send when pressing Enter
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              // Line 311: Placeholder text
              placeholder="Type a message..."
              // Line 313: Styling
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />

            {/* Send button */}
            <button
              // Line 319: Click handler
              onClick={handleSendMessage}
              // Line 321: Disabled when not connected
              disabled={!isConnected}
              // Line 323: Styling with disabled state
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}

export default LiveRooms;
