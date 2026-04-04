import { Award, BookOpen, Globe, Sparkles, Clock, Users, CheckCircle, ArrowRight, Trophy, Zap } from "lucide-react";
import { useState } from "react";

const missions = [
  {
    id: 1,
    title: "Japanese Tea Ceremony Master",
    description: "Learn the art and philosophy behind the traditional Japanese tea ceremony",
    category: "Japanese Culture",
    difficulty: "Intermediate",
    duration: "45 mins",
    participants: 324,
    image: "🍵",
    reward: 150,
    lessons: 5,
    completed: false,
  },
  {
    id: 2,
    title: "Spanish Flamenco Basics",
    description: "Discover the passion and rhythm of flamenco dancing and music",
    category: "Spanish Culture",
    difficulty: "Beginner",
    duration: "30 mins",
    participants: 567,
    image: "💃",
    reward: 100,
    lessons: 4,
    completed: true,
  },
  {
    id: 3,
    title: "Indian Classical Dance",
    description: "Explore Bharatanatyam and other classical dance forms of India",
    category: "Indian Culture",
    difficulty: "Intermediate",
    duration: "50 mins",
    participants: 289,
    image: "🩰",
    reward: 200,
    lessons: 6,
    completed: false,
  },
  {
    id: 4,
    title: "French Cuisine Essentials",
    description: "Master the fundamental techniques and traditions of French cooking",
    category: "French Culture",
    difficulty: "Beginner",
    duration: "60 mins",
    participants: 452,
    image: "👨‍🍳",
    reward: 120,
    lessons: 8,
    completed: false,
  },
  {
    id: 5,
    title: "Brazilian Carnival Culture",
    description: "Immerse yourself in the history, music, and dance of Rio's carnival",
    category: "Brazilian Culture",
    difficulty: "Beginner",
    duration: "35 mins",
    participants: 678,
    image: "🎉",
    reward: 110,
    lessons: 5,
    completed: true,
  },
  {
    id: 6,
    title: "Chinese Martial Arts Philosophy",
    description: "Understand the philosophical roots behind traditional Chinese martial arts",
    category: "Chinese Culture",
    difficulty: "Advanced",
    duration: "55 mins",
    participants: 398,
    image: "🥋",
    reward: 250,
    lessons: 7,
    completed: false,
  },
];

const categories = ["All", "Japanese Culture", "Spanish Culture", "Indian Culture", "French Culture", "Brazilian Culture", "Chinese Culture"];

export default function Missions() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filter, setFilter] = useState("all");

  const filteredMissions = missions.filter((mission) => {
    const categoryMatch = selectedCategory === "All" || mission.category === selectedCategory;
    const filterMatch =
      filter === "all" || (filter === "completed" && mission.completed) || (filter === "available" && !mission.completed);
    return categoryMatch && filterMatch;
  });

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto pt-20">
        {/* HERO SECTION */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-semibold tracking-wider text-orange-600 mb-4">
            <Sparkles className="h-4 w-4" />
            CULTURAL MISSIONS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            Explore World Cultures
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Complete engaging missions to learn about fascinating cultures, traditions, and practices from around the world. Earn rewards and unlock achievements!
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-3 mb-12">
          <div className="rounded-xl border border-white/80 bg-white/90 p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">32</p>
            <p className="text-sm text-slate-600">Total Missions</p>
          </div>
          <div className="rounded-xl border border-white/80 bg-white/90 p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-sm text-slate-600">Completed</p>
          </div>
          <div className="rounded-xl border border-white/80 bg-white/90 p-6 text-center">
            <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">1,240</p>
            <p className="text-sm text-slate-600">Total Points Earned</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              Filter by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "bg-white border border-white/80 text-slate-700 hover:border-orange-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Filter by Status</h2>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Missions" },
                { id: "available", label: "Available" },
                { id: "completed", label: "Completed" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === f.id
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-white/80 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MISSIONS GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="rounded-2xl border border-white/80 bg-white/90 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Mission Header with Image */}
              <div className="relative h-40 bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform">{mission.image}</span>
                {mission.completed && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Mission Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{mission.title}</h3>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                      {mission.category}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-500">{mission.reward}</span>
                </div>

                <p className="text-sm text-slate-600 mb-4">{mission.description}</p>

                {/* Mission Stats */}
                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    {mission.duration}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    {mission.lessons} lessons
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Users className="h-4 w-4 text-green-500" />
                    {mission.participants} completed
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      mission.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : mission.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {mission.difficulty}
                  </span>
                  <button
                    className={`flex items-center gap-1 font-semibold transition ${
                      mission.completed
                        ? "text-green-600 hover:text-green-700"
                        : "text-orange-600 hover:text-orange-700"
                    }`}
                  >
                    {mission.completed ? "Completed" : "Start"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No missions found</h3>
            <p className="text-slate-600">Try adjusting your filters to find more missions</p>
          </div>
        )}

        {/* COMING SOON */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border border-white/80 p-8 text-center">
          <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">More Missions Coming Soon!</h2>
          <p className="text-slate-600">We're constantly adding new cultural missions. Stay tuned for more adventures!</p>
        </div>
      </div>
    </section>
  );
}
