import { Compass, Flame, Globe2, Languages, Sparkles, Target } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const statCards = [
  { title: "Cultural Streak", value: "12 Days", icon: Flame, tone: "from-orange-500 to-rose-500" },
  { title: "Countries Explored", value: "18", icon: Globe2, tone: "from-cyan-500 to-blue-500" },
  { title: "Language Touchpoints", value: "43", icon: Languages, tone: "from-emerald-500 to-teal-500" },
];

const todayMissions = [
  "Share one local festival memory with the community.",
  "Join a live room and ask one cultural question.",
  "Comment on two posts from countries you have never visited.",
];

const suggestedTopics = [
  "Street food stories from around the world",
  "Traditional greetings and their meanings",
  "Music rituals before celebrations",
];

function UserDashBoard() {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-linear-to-b from-amber-50 via-white to-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-[0_24px_80px_-50px_rgba(249,115,22,0.6)] backdrop-blur-sm sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
            <Sparkles className="h-4 w-4" />
            Your Culture Hub
          </p>
          <h1 className="mt-3 text-2xl font-black text-slate-800 sm:text-4xl">
            Welcome back, {user?.username || "Explorer"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Track your cultural growth, discover meaningful conversations, and keep your global curiosity active.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <span className={`rounded-xl bg-linear-to-r p-2 text-white ${card.tone}`}>
                  <card.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-slate-800">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Target className="h-5 w-5 text-orange-600" />
              Today&apos;s Missions
            </h2>
            <ul className="mt-4 space-y-3">
              {todayMissions.map((mission, index) => (
                <li key={mission} className="flex items-start gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Compass className="h-5 w-5 text-pink-600" />
              Suggested Topics
            </h2>
            <div className="mt-4 space-y-3">
              {suggestedTopics.map((topic) => (
                <p key={topic} className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-slate-700">
                  {topic}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default UserDashBoard;