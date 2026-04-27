import { useState, useCallback, useMemo } from "react";
import { getRoomListApiHandler } from "../../../services/api.service";
import type { RoomListItem, UiRoom, Message, RoomUser } from "../../../constants/interface";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const mapRoomListItemToUiRoom = (room: RoomListItem): UiRoom => ({
  id: String(room.id),
  roomId: room.id,
  name: room.name,
  language: room.language,
  slug: toSlug(room.name),
  visibility: room.visibility,
  description: room.description || undefined,
  createdAt: new Date().toISOString(),
});

export const useRoomHandler = (isAuthenticated: boolean) => {
  // Room state
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [selectedUiRoomId, setSelectedUiRoomId] = useState<string | null>(null);
  const [joinedRoomIds, setJoinedRoomIds] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [socketError, setSocketError] = useState("");

  // Create room state
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [language, setLanguage] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [capacity, setCapacity] = useState("100");
  const [roomPassword, setRoomPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedUiRoomId) || null,
    [rooms, selectedUiRoomId]
  );

  const filteredRooms = useMemo(() => {
    const key = searchTerm.trim().toLowerCase();
    if (!key) return rooms;

    return rooms.filter((room) => {
      return (
        room.name.toLowerCase().includes(key) ||
        room.language.toLowerCase().includes(key) ||
        String(room.roomId).includes(key) ||
        (room.slug || "").toLowerCase().includes(key)
      );
    });
  }, [rooms, searchTerm]);

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) {
      setRooms([]);
      setSelectedUiRoomId(null);
      return;
    }

    setLoadingRooms(true);
    try {
      const result = await getRoomListApiHandler();
      const fetchedRooms = (result.data || []).map(mapRoomListItemToUiRoom);

      setRooms(fetchedRooms);
      setSelectedUiRoomId((prev) => {
        if (prev && fetchedRooms.some((room) => room.id === prev)) {
          return prev;
        }
        return fetchedRooms[0]?.id || null;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load rooms";
      setSocketError(message);
      setRooms([]);
      setSelectedUiRoomId(null);
    } finally {
      setLoadingRooms(false);
    }
  }, [isAuthenticated]);

  const resetRoomUi = () => {
    setMessages([]);
    setRoomUsers([]);
    setSocketError("");
  };

  return {
    // State
    rooms,
    setRooms,
    selectedUiRoomId,
    setSelectedUiRoomId,
    selectedRoom,
    joinedRoomIds,
    setJoinedRoomIds,
    messages,
    setMessages,
    roomUsers,
    setRoomUsers,
    searchTerm,
    setSearchTerm,
    loadingRooms,
    socketError,
    setSocketError,
    showCreate,
    setShowCreate,
    roomName,
    setRoomName,
    language,
    setLanguage,
    visibility,
    setVisibility,
    capacity,
    setCapacity,
    roomPassword,
    setRoomPassword,
    creating,
    setCreating,
    filteredRooms,
    // Functions
    fetchRooms,
    resetRoomUi,
    toSlug,
  };
};
