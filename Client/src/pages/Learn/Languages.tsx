import { BookOpen, Globe, Sparkles, Trophy, Users, Clock, BarChart3, Award, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

const languages = [
  {
    id: 1,
    name: "Spanish",
    flag: "🇪🇸",
    learners: "45,324",
    difficulty: "Beginner",
    duration: "12 weeks",
    lessons: 48,
    progress: 40,
    rating: 4.8,
    description: "Learn Spanish from basics to conversational fluency",
    modules: ["Alphabet & Basics", "Common Phrases", "Grammar", "Conversation", "Culture"],
  },
  {
    id: 2,
    name: "French",
    flag: "🇫🇷",
    learners: "38,912",
    difficulty: "Beginner",
    duration: "12 weeks",
    lessons: 48,
    progress: 0,
    rating: 4.9,
    description: "Master the language of love and culture",
    modules: ["Pronunciation", "Vocabulary", "Phrases", "Advanced Grammar", "Literature"],
  },
  {
    id: 3,
    name: "Mandarin Chinese",
    flag: "🇨🇳",
    learners: "32,456",
    difficulty: "Advanced",
    duration: "16 weeks",
    lessons: 64,
    progress: 0,
    rating: 4.7,
    description: "Explore the world's most spoken language",
    modules: ["Chinese Characters", "Tones", "Daily Conversation", "Business Chinese", "Poetry"],
  },
  {
    id: 4,
    name: "Japanese",
    flag: "🇯🇵",
    learners: "28,765",
    difficulty: "Intermediate",
    duration: "14 weeks",
    lessons: 56,
    progress: 25,
    rating: 4.8,
    description: "Learn Japanese hiragana, katakana, and kanji",
    modules: ["Hiragana & Katakana", "Kanji Basics", "Polite Speech", "Advanced Grammar", "Media & Culture"],
  },
  {
    id: 5,
    name: "Arabic",
    flag: "🇸🇦",
    learners: "24,567",
    difficulty: "Advanced",
    duration: "16 weeks",
    lessons: 64,
    progress: 0,
    rating: 4.6,
    description: "Discover the beauty of the Arabic language",
    modules: ["Arabic Alphabet", "Grammar", "Dialects", "Religious Texts", "Modern Arabic"],
  },
  {
    id: 6,
    name: "Hindi",
    flag: "🇮🇳",
    learners: "19,234",
    difficulty: "Intermediate",
    duration: "14 weeks",
    lessons: 56,
    progress: 15,
    rating: 4.7,
    description: "Learn Hindi and connect with Indian culture",
    modules: ["Devanagari Script", "Basic Grammar", "Conversation", "Business Hindi", "Cinema Language"],
  },
];

const benefits = [
  { icon: Globe, title: "Global Connection", desc: "Connect with native speakers worldwide" },
  { icon: Users, title: "Community Learning", desc: "Learn together with thousands of students" },
  { icon: Trophy, title: "Certification", desc: "Earn recognized language certificates" },
  { icon: Star, title: "Expert Teachers", desc: "Learn from native speakers and linguists" },
];

export default function Languages() {
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const filteredLanguages = languages.filter(
    (lang) => filterDifficulty === "All" || lang.difficulty === filterDifficulty
  );

  const selectedLangData = selectedLanguage ? languages.find((l) => l.id === selectedLanguage) : null;

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto pt-20">
        {/* HERO SECTION */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-xs font-semibold tracking-wider text-orange-600 mb-4">
            <Sparkles className="h-4 w-4" />
            LANGUAGE COURSES
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
            Learn Languages From Native Speakers
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Master new languages through interactive lessons, live conversations, and cultural immersion. Start your language journey today!
          </p>
        </div>

        {/* BENEFITS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="rounded-xl border border-white/80 bg-white/90 p-5 text-center">
                <Icon className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-3">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filterDifficulty === level
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "bg-white border border-white/80 text-slate-700 hover:border-orange-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* LANGUAGE CARDS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredLanguages.map((lang) => (
            <div
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`rounded-2xl border cursor-pointer transition-all ${
                selectedLanguage === lang.id
                  ? "border-orange-500 bg-white shadow-xl"
                  : "border-white/80 bg-white/90 hover:shadow-lg"
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{lang.flag}</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{lang.name}</h3>
                      <p className="text-xs text-slate-500">{lang.learners} learners</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-800">{lang.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{lang.description}</p>
              </div>

              {/* Stats */}
              <div className="p-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    {lang.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    {lang.lessons} lessons
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      lang.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : lang.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lang.difficulty}
                  </span>
                </div>

                {/* Progress Bar if started */}
                {lang.progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600">Progress</span>
                      <span className="text-xs font-bold text-orange-600">{lang.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${lang.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                    lang.progress > 0
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg"
                  }`}
                >
                  {lang.progress > 0 ? "Continue" : "Start Course"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED VIEW */}
        {selectedLangData && (
          <div className="rounded-2xl border border-orange-500 bg-white overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{selectedLangData.flag}</span>
                <div>
                  <h2 className="text-3xl font-bold">{selectedLangData.name}</h2>
                  <p className="text-orange-100">{selectedLangData.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Course Modules
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {selectedLangData.modules.map((module, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 p-4 border border-orange-200 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-800">{module}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button className="btn bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg">
                  <Award className="h-5 w-5" />
                  Enroll Now
                </button>
                <button className="btn btn-outline border-orange-300 text-orange-600 hover:bg-orange-50">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
