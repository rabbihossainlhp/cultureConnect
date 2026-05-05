import { ArrowRight, BookOpen, Globe, Heart, MessageCircle, Sparkles, Star, Users, Zap } from "lucide-react";

const highlights = [
  { icon: Users, title: "Global Members", value: "12,400+" },
  { icon: MessageCircle, title: "Active Conversations", value: "3,200+" },
  { icon: Globe, title: "Countries Connected", value: "95+" },
];

const languages = [
  { name: "Spanish", members: "2,340", flag: "🇪🇸", rooms: 12 },
  { name: "French", members: "1,890", flag: "🇫🇷", rooms: 9 },
  { name: "Mandarin", members: "1,650", flag: "🇨🇳", rooms: 8 },
  { name: "Arabic", members: "1,450", flag: "🇸🇦", rooms: 7 },
  { name: "Japanese", members: "1,230", flag: "🇯🇵", rooms: 6 },
  { name: "Hindi", members: "980", flag: "🇮🇳", rooms: 5 },
];

const featuredRooms = [
  {
    id: 1,
    name: "Spanish Café",
    language: "Spanish",
    members: 234,
    description: "Practice conversational Spanish with the help of native speakers.",
    color: "from-yellow-400 to-orange-400",
    activity: "🔴 15 members active",
  },
  {
    id: 2,
    name: "Tokyo Cultural Exchange",
    language: "Japanese",
    members: 189,
    description: "Explore Japanese traditions, customs, and contemporary culture.",
    color: "from-rose-400 to-pink-500",
    activity: "🔴 8 members active",
  },
  {
    id: 3,
    name: "French Bistro",
    language: "French",
    members: 167,
    description: "Discuss French cuisine, art, literature, and cinema.",
    color: "from-sky-400 to-indigo-500",
    activity: "🔴 12 members active",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and tell us about your cultural interests and languages.",
    icon: Users,
  },
  {
    step: 2,
    title: "Explore Rooms",
    description: "Browse by language, culture, or activity type that interests you.",
    icon: Globe,
  },
  {
    step: 3,
    title: "Join a Room",
    description: "Click join and start connecting with people who share your interests.",
    icon: MessageCircle,
  },
  {
    step: 4,
    title: "Engage & Learn",
    description: "Participate in live chats, cultural sessions, and build friendships.",
    icon: Star,
  },
];

const testimonials = [
  {
    name: "Maria García",
    location: "Madrid, Spain",
    quote: "I've made friends from 5 different countries. This community is life-changing.",
    avatar: "👩",
    flag: "🇪🇸",
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    quote: "Learning about different cultures while practicing languages is amazing here.",
    avatar: "👨",
    flag: "🇯🇵",
  },
  {
    name: "Sophie Martin",
    location: "Paris, France",
    quote: "The live cultural sessions are incredible. I feel like I'm traveling the world.",
    avatar: "👩",
    flag: "🇫🇷",
  },
];

export default function Community() {
  return (
    <section className="w-full bg-linear-to-b from-orange-50 via-white to-pink-50 px-4 py-12 sm:px-6 lg:px-8 cc-page-offset">
      <div className="mx-auto max-w-7xl pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-semibold tracking-wider text-orange-600 shadow-sm">
              <Sparkles className="h-4 w-4" />
              COMMUNITY HUB
            </p>

            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
              Connect With People
              <br />
              Across Cultures
            </h1>

            <p className="mt-4 max-w-xl text-slate-600">
              Discover communities, join cultural rooms, and build real friendships with people around the world.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn border-none bg-linear-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg">
                Join a Room
              </button>
              <button className="btn btn-outline border-orange-300 text-orange-600 hover:bg-orange-50">
                Explore Communities
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)]">
            <img
              src="/images/hero_world_map.jpg"
              alt="World map community"
              className="h-60 w-full object-cover sm:h-80 lg:h-96"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm transition hover:shadow-md"
          >
            <item.icon className="h-5 w-5 text-orange-500" />
            <p className="mt-3 text-sm text-slate-500">{item.title}</p>
            <p className="text-2xl font-extrabold text-slate-800">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto max-w-7xl py-12">
        <div className="mb-8 flex items-center gap-2">
          <Zap className="h-6 w-6 text-orange-500" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Featured Rooms</h2>
            <p className="mt-1 text-slate-600">Join trending rooms and connect with active communities.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room) => (
            <article key={room.id} className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`h-32 bg-linear-to-r ${room.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{room.name}</h3>
                    <p className="text-sm font-semibold text-orange-600">{room.language}</p>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    {room.members} members
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{room.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-green-600">{room.activity}</span>
                  <button className="inline-flex items-center gap-1 font-semibold text-orange-500 transition hover:gap-2 hover:text-orange-600">
                    Join <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-12">
        <div className="mb-8 flex items-center gap-2">
          <Globe className="h-6 w-6 text-pink-500" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Browse by Language</h2>
            <p className="mt-1 text-slate-600">Learn and practice with native speakers around the globe.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang) => (
            <article key={lang.name} className="rounded-xl border border-white/80 bg-white/90 p-5 transition hover:shadow-md">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">{lang.name}</h3>
                    <p className="text-xs text-slate-500">{lang.rooms} rooms</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-orange-600">{lang.members}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-orange-400 to-pink-400"
                  style={{ width: `${(parseInt(lang.members, 10) / 2340) * 100}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-12">
        <div className="mb-8 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sky-500" />
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">How It Works</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item) => {
            const IconComponent = item.icon;
            return (
              <article key={item.step} className="rounded-xl border border-white/80 bg-white/90 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-pink-400">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-bold text-slate-800">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl rounded-3xl border border-white/80 bg-linear-to-r from-orange-100 to-pink-100 p-6 py-12 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800 sm:text-3xl">
          <Heart className="h-6 w-6 text-red-500" />
          Why Join This Community?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h3 className="font-bold text-slate-800">Connect Globally</h3>
              <p className="text-sm text-slate-600">Practice language with native speakers.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🎭</span>
            <div>
              <h3 className="font-bold text-slate-800">Explore Cultures</h3>
              <p className="text-sm text-slate-600">Participate in live cultural sessions.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-bold text-slate-800">Build Friendships</h3>
              <p className="text-sm text-slate-600">Create meaningful international connections.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-bold text-slate-800">Share Stories</h3>
              <p className="text-sm text-slate-600">Share traditions, customs, and experiences.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-12">
        <div className="mb-8 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Member Stories</h2>
            <p className="mt-1 text-slate-600">See what our community members are saying.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-2xl border border-white/80 bg-white/90 p-6 transition hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">{testimonial.avatar}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{testimonial.name}</h3>
                    <span className="text-xl">{testimonial.flag}</span>
                  </div>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </div>
              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-slate-600">"{testimonial.quote}"</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl py-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-800 sm:text-4xl">Ready to Start Your Cultural Journey?</h2>
        <p className="mb-8 text-lg text-slate-600">Join thousands of people learning languages and exploring cultures together.</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="btn btn-lg border-none bg-linear-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg">
            Explore Rooms Now
          </button>
          <button className="btn btn-lg btn-outline border-orange-300 text-orange-600 hover:bg-orange-50">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
