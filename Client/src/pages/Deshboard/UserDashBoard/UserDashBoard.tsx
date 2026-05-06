import { useEffect, useState } from "react";
import {
  ArrowRight,
  Compass,
  Languages,
  Layers,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Video,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { getPostListApiHandler, getRoomListApiHandler } from "../../../services/api.service";

const quickActions = [
  { label: "Explore", to: "/explore", icon: Compass },
  { label: "Live Rooms", to: "/live-rooms", icon: Video },
  { label: "Community", to: "/community", icon: MessageCircle },
  { label: "Missions", to: "/learn/missions", icon: Languages },
];

function UserDashBoard() {
  const { user } = useAuth();
  const [roomsCount, setRoomsCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [recentRooms, setRecentRooms] = useState<{ id: string | number; name: string; language: string; visibility: string }[]>([]);
  const [recentPosts, setRecentPosts] = useState<{ id: number; title: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [roomRes, postRes] = await Promise.all([
          getRoomListApiHandler(),
          getPostListApiHandler(),
        ]);

        const roomData = roomRes.data || [];
        const postData = postRes.data || [];

        setRoomsCount(roomData.length);
        setPostsCount(postData.length);
        setRecentRooms(
          roomData.slice(0, 4).map((room) => ({
            id: room.id,
            name: room.name,
            language: room.language,
            visibility: room.visibility,
          }))
        );
        setRecentPosts(
          postData.slice(0, 4).map((post) => ({
            id: post.id,
            title: post.title,
            created_at: post.created_at,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  return (
    <section className="cc-page-offset min-h-screen bg-linear-to-b from-amber-50 via-white to-orange-50 px-3 pb-8 sm:px-6 sm:pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-orange-100 bg-white/90 p-4 shadow-[0_24px_80px_-50px_rgba(249,115,22,0.6)] backdrop-blur-sm sm:p-8">
          <h1 className="text-xl font-black leading-tight text-slate-800 sm:text-3xl">
            Hello, {user?.username || "Explorer"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A minimal dashboard using your current data.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-orange-700">Country</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4" />
                {user?.country || "Global"}
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-cyan-700">Available Rooms</p>
              <p className="mt-1 font-semibold">{roomsCount}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Posts</p>
              <p className="mt-1 font-semibold">{postsCount}</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-700">Native Language</p>
              <p className="mt-1 font-semibold">{user?.native_language || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <NavLink
                key={action.label}
                to={action.to}
                className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <action.icon className="h-4 w-4 text-orange-600" />
                    <span className="truncate">{action.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5" />
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Video className="h-5 w-5 text-cyan-600" />
              Rooms
            </h2>
            {loading ? (
              <p className="mt-3 text-sm text-slate-500">Loading rooms...</p>
            ) : recentRooms.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No rooms available yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recentRooms.map((room) => (
                  <li key={String(room.id)} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-800">{room.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{room.language} • {room.visibility}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Layers className="h-5 w-5 text-orange-600" />
              Recent Posts
            </h2>
            {loading ? (
              <p className="mt-3 text-sm text-slate-500">Loading posts...</p>
            ) : recentPosts.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No posts found.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-800">{post.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cc-btn cc-btn-ghost"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserDashBoard;