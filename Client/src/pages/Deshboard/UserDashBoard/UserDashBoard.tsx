import { useEffect } from "react";
import {io} from "socket.io-client";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  Flame,
  Globe2,
  Languages,
  MapPin,
  MessageCircle,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";



const statCards = [
  { title: "Cultural Streak", value: "12 Days", icon: Flame, tone: "from-orange-500 to-rose-500" },
  { title: "Countries Explored", value: "18", icon: Globe2, tone: "from-cyan-500 to-blue-500" },
  { title: "Language Touchpoints", value: "43", icon: Languages, tone: "from-emerald-500 to-teal-500" },
];

const quickActions = [
  { label: "Explore New Culture", to: "/explore", icon: Compass },
  { label: "Join Community", to: "/community", icon: MessageCircle },
  { label: "Start Daily Mission", to: "/explore", icon: Target },
];

const todayPlan = [
  { time: "09:00 AM", text: "Read one story from another country" },
  { time: "12:30 PM", text: "Leave a comment in community discussion" },
  { time: "08:00 PM", text: "Complete one mini language challenge" },
];

const recentActivity = [
  "You joined a discussion: Traditional wedding rituals",
  "You completed mission: Share a hometown dish",
  "You received 4 reactions on your culture post",
];

const highlights = [
  "Japan Culture Week starts tomorrow",
  "Top topic today: Greetings Around the World",
  "New language room: Spanish for Travelers",
];

function UserDashBoard() {
  const { user } = useAuth();

  useEffect(() => {
    const socket = io('http://localhost:4713/',{
      withCredentials:true,
    });


    socket.on('room:room-joined',(data)=>{
        console.log('Joined: ', data.message);
      });

      socket.on('room:user_left',(userData)=>{
        console.log(`${userData.username} left the room`);
      });

      socket.on('chat:new', (messageData)=>{
        console.log(`${messageData.username}: ${messageData.text}`)
      });


    socket.on('connect',()=>{
      console.log('Client socket connected: ', socket.id);
      socket.emit('room:join','room-1',{
        userId:user?.email,
        username:user?.username,
        country:user?.country,
      });

      
    });
    socket.on('disconnect',(reason)=>{
      console.log('Client socket disconnected: ', socket.id, reason);
    });

    return ()=>{
      socket.emit('room:leave','room-1',{
        userId:user?.email,
        username:user?.username
      })
      socket.disconnect();
    }

  },[])

  return (
    <section className="min-h-screen bg-linear-to-b from-amber-50 via-white to-orange-50 px-3 pb-8 pt-22 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-orange-100 bg-white/90 p-4 shadow-[0_24px_80px_-50px_rgba(249,115,22,0.6)] backdrop-blur-sm sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
            <Sparkles className="h-4 w-4" />
            Welcome Home
          </p>
          <h1 className="mt-3 text-xl font-black leading-tight text-slate-800 sm:text-4xl">
            Hello, {user?.username || "Explorer"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This is your personal CultureConnect home. Track progress, discover people, and continue your global journey.
          </p>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-orange-700">Current Focus</p>
              <p className="mt-1 font-semibold">Cross-cultural communication</p>
            </div>
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-rose-700">Location</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4" />
                {user?.country || "Global"}
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 px-4 py-3 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-cyan-700">Next Event</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <CalendarDays className="h-4 w-4" />
                Community Live Room
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {statCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <span className={`rounded-xl bg-linear-to-r p-2 text-white ${card.tone}`}>
                  <card.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-slate-800 sm:mt-4 sm:text-3xl">{card.value}</p>
            </article>
          ))}
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

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Clock3 className="h-5 w-5 text-orange-600" />
              Today Plan
            </h2>
            <ul className="mt-3 space-y-3 sm:mt-4">
              {todayPlan.map((item, idx) => (
                <li key={item.time} className="flex items-start gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{item.time}</p>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <Rocket className="h-5 w-5 text-pink-600" />
              Community Highlights
            </h2>
            <div className="mt-3 space-y-3 sm:mt-4">
              {highlights.map((item) => (
                <p key={item} className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
          <ul className="mt-3 grid gap-3 sm:mt-4 md:grid-cols-3">
            {recentActivity.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default UserDashBoard;