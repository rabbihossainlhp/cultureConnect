import { Globe, Users, Sparkles, MessageCircle, Star, ArrowRight, BookOpen, Zap, Heart } from "lucide-react";

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
    description: "Practice conversational Spanish with the help of native speakers",
    color: "from-yellow-400 to-orange-400",
    activity: "🔴 15 members active",
  },
  {
    id: 2,
    name: "Tokyo Cultural Exchange",
    language: "Japanese",
    members: 189,
    description: "Explore Japanese traditions, customs, and contemporary culture",
    color: "from-red-400 to-pink-400",
    activity: "🔴 8 members active",
  },
  {
    id: 3,
    name: "French Bistro",
    language: "French",
    members: 167,
    description: "Discuss French cuisine, art, literature, and cinema",
    color: "from-blue-400 to-purple-400",
    activity: "🔴 12 members active",
  },
];

const howitWorks = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and tell us about your cultural interests and languages",
    icon: Users,
  },
  {
    step: 2,
    title: "Explore Rooms",
    description: "Browse by language, culture, or activity type that interests you",
    icon: Globe,
  },
  {
    step: 3,
    title: "Join a Room",
    description: "Click join and start connecting with people who share your interests",
    icon: MessageCircle,
  },
  {
    step: 4,
    title: "Engage & Learn",
    description: "Participate in live chats, cultural sessions, and build friendships",
    icon: Star,
  },
];

const testimonials = [
  {
    name: "Maria García",
    location: "Madrid, Spain",
    quote: "I've made friends from 5 different countries! This community is life-changing.",
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
    quote: "The live cultural sessions are incredible. I feel like I'm traveling the world!",
    avatar: "👩",
    flag: "🇫🇷",
  },
];

export default function Community() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto pt-12 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
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
              <button className="btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg transition">
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
      </div>

      {/* STATS SECTION */}
      <div className="max-w-7xl mx-auto py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm hover:shadow-md transition"
          >
            <item.icon className="h-5 w-5 text-orange-500" />
            <p className="mt-3 text-sm text-slate-500">{item.title}</p>
            <p className="text-2xl font-extrabold text-slate-800">{item.value}</p>
          </article>
        ))}
      </div>

      {/* FEATURED ROOMS SECTION */}
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" />
            Featured Rooms
          </h2>
          <p className="text-slate-600 mt-2">Join trending rooms and connect with active communities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl overflow-hidden border border-white/80 bg-white/90 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={`h-32 bg-gradient-to-r ${room.color}`}></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{room.name}</h3>
                    <p className="text-sm text-orange-600 font-semibold">{room.language}</p>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                    {room.members} members
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-3">{room.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-green-600">{room.activity}</span>
                  <button className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition">
                    Join <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BROWSE BY LANGUAGE SECTION */}
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Globe className="h-6 w-6 text-pink-500" />
            Browse by Language
          </h2>
          <p className="text-slate-600 mt-2">Learn and practice with native speakers around the globe</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="rounded-xl border border-white/80 bg-white/90 p-5 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">{lang.name}</h3>
                    <p className="text-xs text-slate-500">{lang.rooms} rooms</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                  {lang.members}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full"
                  style={{ width: `${(parseInt(lang.members) / 2340) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            How It Works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howitWorks.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.step} className="rounded-xl border border-white/80 bg-white/90 p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 mb-4">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY JOIN SECTION */}
      <div className="max-w-7xl mx-auto py-12 rounded-3xl bg-gradient-to-r from-orange-100 to-pink-100 border border-white/80 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-red-500" />
          Why Join This Community?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h3 className="font-bold text-slate-800">Connect Globally</h3>
              <p className="text-sm text-slate-600">Practice language with native speakers</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🎭</span>
            <div>
              <h3 className="font-bold text-slate-800">Explore Cultures</h3>
              <p className="text-sm text-slate-600">Participate in live cultural sessions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-bold text-slate-800">Build Friendships</h3>
              <p className="text-sm text-slate-600">Create meaningful international connections</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-bold text-slate-800">Share Stories</h3>
              <p className="text-sm text-slate-600">Share traditions, customs, and experiences</p>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Member Stories
          </h2>
          <p className="text-slate-600 mt-2">See what our community members are saying</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="rounded-2xl border border-white/80 bg-white/90 p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{testimonial.avatar}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{testimonial.name}</h3>
                    <span className="text-xl">{testimonial.flag}</span>
                  </div>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          Ready to Start Your Cultural Journey?
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Join thousands of people learning languages and exploring cultures together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn btn-lg bg-linear-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg">
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