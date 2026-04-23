import { Rocket, Target, Trophy, Flame, Zap, BookOpen, Users, Award, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Missions() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = () => {
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              <Rocket size={16} />
              Coming Soon
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
                Learn Through
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Exciting Missions
                </span>
              </h1>
              <p className="text-xl text-slate-600">
                Complete challenging missions, earn rewards, and master cultures from around the world. Educational gamification at its finest.
              </p>
            </div>

            {/* Features Preview */}
            <div className="space-y-4">
              {[
                { icon: Target, title: "Goal-Oriented Learning", desc: "Complete missions with clear objectives" },
                { icon: Trophy, title: "Earn Rewards", desc: "Get points and badges for achievements" },
                { icon: Flame, title: "Build Streaks", desc: "Stay consistent and maintain daily streaks" },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{feature.title}</p>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="pt-4">
              <p className="text-sm font-semibold text-slate-700 mb-3">Get notified when it launches</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm"
                />
                <button
                  onClick={handleNotify}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  Notify Me
                </button>
              </div>
              {subscribed && (
                <p className="text-green-600 text-sm mt-2 font-semibold">✓ Added to waitlist!</p>
              )}
            </div>
          </div>

          {/* Right Section - Visual */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            {/* Card Display */}
            <div className="relative space-y-6 w-full px-6">
              {[
                { emoji: "🎯", title: "Japanese Tea Ceremony", level: "Intermediate" },
                { emoji: "💃", title: "Spanish Flamenco", level: "Beginner" },
                { emoji: "🩰", title: "Indian Classical Dance", level: "Intermediate" },
              ].map((mission, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/80 backdrop-blur border border-white/50 shadow-lg transform hover:scale-105 transition"
                  style={{ transform: `translateX(${idx * 20}px)` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mission.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{mission.title}</p>
                      <p className="text-xs text-slate-500">{mission.level}</p>
                    </div>
                    <Sparkles size={16} className="text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 bg-white/60 backdrop-blur rounded-2xl p-8 border border-white/50">
          {[
            { icon: Zap, label: "Missions", value: "50+" },
            { icon: Trophy, label: "Rewards", value: "1000+" },
            { icon: Users, label: "Learners", value: "10K+" },
            { icon: BookOpen, label: "Hours", value: "100+" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <stat.icon className="mx-auto mb-2 text-indigo-600" size={32} />
              <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">
            Estimated Launch: <span className="font-bold text-indigo-600">Q2 2026</span>
          </p>
          <div className="inline-block">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold animate-pulse">
              More exciting features coming soon... 🚀
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
