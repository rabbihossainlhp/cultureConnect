import { Rocket, Zap, Globe, Award, Users, BookOpen, Volume2, Brain, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Languages() {
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
    <section className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
              <Rocket size={16} />
              Coming Soon
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
                Master World
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                  Languages
                </span>
              </h1>
              <p className="text-xl text-slate-600">
                Learn 50+ languages with native speakers. Interactive lessons, real conversations, and cultural immersion all in one platform.
              </p>
            </div>

            {/* Features Preview */}
            <div className="space-y-4">
              {[
                { icon: Volume2, title: "Native Pronunciations", desc: "Learn from authentic pronunciation guides" },
                { icon: Brain, title: "Adaptive Learning", desc: "AI-powered lessons tailored to your pace" },
                { icon: Globe, title: "Cultural Context", desc: "Learn language within cultural frameworks" },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0">
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
              <p className="text-sm font-semibold text-slate-700 mb-3">Get early access when we launch</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-sm"
                />
                <button
                  onClick={handleNotify}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105"
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            {/* Language Cards */}
            <div className="relative space-y-6 w-full px-6">
              {[
                { flag: "🇪🇸", name: "Spanish", level: "Beginner", learners: "45K+" },
                { flag: "🇫🇷", name: "French", level: "Beginner", learners: "38K+" },
                { flag: "🇯🇵", name: "Japanese", level: "Intermediate", learners: "29K+" },
              ].map((lang, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/80 backdrop-blur border border-white/50 shadow-lg transform hover:scale-105 transition"
                  style={{ transform: `translateX(${idx * 20}px)` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{lang.name}</p>
                      <p className="text-xs text-slate-500">{lang.learners} learners</p>
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
            { icon: BookOpen, label: "Languages", value: "50+" },
            { icon: Users, label: "Learners", value: "100K+" },
            { icon: Award, label: "Lessons", value: "5000+" },
            { icon: Zap, label: "Hours", value: "200+" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <stat.icon className="mx-auto mb-2 text-emerald-600" size={32} />
              <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">
            Estimated Launch: <span className="font-bold text-emerald-600">Q3 2026</span>
          </p>
          <div className="inline-block">
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold animate-pulse">
              Breaking language barriers worldwide... 🌍
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
