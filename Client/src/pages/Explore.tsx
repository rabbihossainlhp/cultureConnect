import { BookOpenText, PencilLine, Search } from "lucide-react";
import ExploreCard from '../components/common/ExploreCard';

function Explore() {
  return (
    <main className="min-h-screen pt-24 pb-14 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-amber-50 via-white to-sky-50">
      <section className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(234,88,12,0.4)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-semibold tracking-wide text-orange-700">
            <BookOpenText className="h-4 w-4" />
            CULTURE BLOG
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-800">
            Explore Real Stories From Real Cultures
          </h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            Discover community-written posts about traditions, food, language, and festivals.
            CultureConnect turns cultural learning into shared stories.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="btn bg-linear-to-r from-orange-500 to-pink-500 border-none text-white">
              <PencilLine className="h-4 w-4" />
              Write a Culture Post
            </button>
            <button className="btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-50">
              <Search className="h-4 w-4" />
              Search Posts
            </button>
          </div>
        </div>
      </section>
      
      <ExploreCard/>
      
    </main>
  );
}

export default Explore;