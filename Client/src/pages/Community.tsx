import { Globe, Users, Sparkles, MessageCircle, Compass } from "lucide-react";

const highlights = [
  { icon: Users, title: "Global Members", value: "12,400+" },
  { icon: MessageCircle, title: "Active Conversations", value: "3,200+" },
  { icon: Globe, title: "Countries Connected", value: "95+" },
];

export default function Community() {
  return (
    <section className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-semibold tracking-wider text-orange-600">
            <Sparkles className="h-4 w-4" />
            COMMUNITY HUB
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-800">
            Connect With People
            <br />
            Across Cultures
          </h1>

          <p className="mt-4 text-slate-600 max-w-xl">
            Discover communities, join cultural rooms, and build real friendships with people
            around the world.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none">
              Join a Room
            </button>
            <button className="btn btn-outline border-orange-300 text-orange-600 hover:bg-orange-50">
              Explore Communities
            </button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/80 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)]">
          <img
            src="/images/hero_world_map.jpg"
            alt="World map community"
            className="w-full h-[240px] sm:h-[320px] object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm"
          >
            <item.icon className="h-5 w-5 text-orange-500" />
            <p className="mt-3 text-sm text-slate-500">{item.title}</p>
            <p className="text-2xl font-extrabold text-slate-800">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-10 rounded-3xl bg-white/90 border border-white/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Compass className="h-5 w-5 text-pink-500" />
          Why Join This Community?
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-slate-600">
          <li>- Practice language with native speakers</li>
          <li>- Participate in live cultural sessions</li>
          <li>- Build international friendships</li>
          <li>- Share stories, traditions, and ideas</li>
        </ul>
      </div>
    </section>
  );
}