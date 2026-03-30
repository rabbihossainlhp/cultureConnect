// Explore.tsx
import { BookOpenText, PencilLine, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import ExploreCard from '../components/common/ExploreCard';

function Explore() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50/40 via-white to-sky-50/60">
      {/* Animated background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative max-w-7xl mx-auto">
        {/* Hero Section with enhanced glass morphism and social media style */}
        <div className="relative rounded-3xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl p-8 sm:p-10 overflow-hidden">
          {/* Gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-pink-400 to-sky-400"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50/80 backdrop-blur-sm px-5 py-1.5 text-sm font-semibold tracking-wide text-orange-700 shadow-sm">
                <BookOpenText className="h-4 w-4" />
                CULTURE BLOG
                <span className="ml-1 flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              </p>
              
              {/* Social proof mini stats */}
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 2.4k+ readers</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> 120+ stories</span>
              </div>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight bg-gradient-to-r from-slate-800 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Explore Real Stories <br />
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">From Real Cultures</span>
            </h1>

            <p className="mt-5 max-w-2xl text-slate-600 text-lg leading-relaxed">
              Discover community-written posts about traditions, food, language, and festivals.
              CultureConnect turns cultural learning into shared stories.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <PencilLine className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Write a Culture Post
                  <Sparkles className="h-3.5 w-3.5 opacity-70" />
                </span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 font-semibold hover:bg-white hover:border-orange-200 hover:text-orange-600 hover:shadow-md transition-all duration-300 group">
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Search Posts
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <ExploreCard />
    </main>
  );
}

export default Explore;