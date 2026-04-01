import { Link } from "react-router";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Tag,
  UserRound,
  MapPin,
  Bookmark,
  Share2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { PostItem } from "../../constants/interface";

const categoryColors: Record<string, string> = {
  Tradition: "from-emerald-500 to-teal-500",
  Food: "from-amber-500 to-orange-500",
  Language: "from-sky-500 to-blue-500",
  Festival: "from-rose-500 to-pink-500",
  History: "from-indigo-500 to-purple-500",
  General: "from-slate-500 to-gray-500",
};

type ExploreCardProps = {
  posts: PostItem[];
  isLoading?: boolean;
};

const toTitleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\w/g, (m) => m.toUpperCase());

export default function ExploreCard({ posts, isLoading = false }: ExploreCardProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      const firstTag = post.tags?.[0];
      set.add(firstTag ? toTitleCase(firstTag) : "General");
    }
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((post) => {
          const firstTag = post.tags?.[0];
          const category = firstTag ? toTitleCase(firstTag) : "General";
          return category === activeFilter;
        });

  const handleSave = (postId: number) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  return (
    <section className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      {/* Filter Section with enhanced design */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === item
                  ? "bg-linear-to-r from-orange-500 to-pink-500 text-white shadow-md shadow-orange-200 scale-105"
                  : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        
        {/* Trending indicator */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
          <span>Trending stories this week</span>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-8 text-center text-slate-500">
          Loading posts...
        </div>
      ) : null}

      {!isLoading && filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-8 text-center text-slate-500">
          No posts found for this filter.
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const isSaved = savedPosts.includes(post.id);
          const category = post.tags?.[0] ? toTitleCase(post.tags[0]) : "General";
          const gradientColor = categoryColors[category] || categoryColors.General;
          
          return (
            <article
              key={post.id}
              className="group relative rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Category gradient bar */}
              <div className={`h-1.5 w-full bg-linear-to-r ${gradientColor}`}></div>
              
              <div className="p-5">
                {/* Header with category and country */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-linear-to-r ${gradientColor}/10 px-3 py-1 text-xs font-semibold text-slate-700 border border-white/50`}>
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <MapPin className="h-3 w-3" />
                    Global
                  </div>
                </div>

                {/* Title */}
                <h2 className="mt-4 text-xl font-bold leading-tight text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {post.title}
                </h2>
                
                {/* Excerpt */}
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {post.description || "No description available yet."}
                </p>

                {/* Author metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" />
                    Community Author
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readtime || "3 min read"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Interaction bar - Social media style */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-5">
                    {/* Like button */}
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-all duration-200 ${
                        isLiked ? "text-pink-500" : "text-slate-500 hover:text-pink-500"
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-pink-500" : ""} transition-transform hover:scale-110`} />
                      <span className="font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    
                    {/* Comment button */}
                    <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-500 transition-colors">
                      <MessageCircle className="h-4.5 w-4.5 hover:scale-110 transition-transform" />
                      <span className="font-medium">{post.comments_count}</span>
                    </button>
                    
                    {/* Share button */}
                    <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                      <Share2 className="h-4 w-4 hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Save button */}
                    <button 
                      onClick={() => handleSave(post.id)}
                      className={`transition-all duration-200 ${
                        isSaved ? "text-orange-500" : "text-slate-400 hover:text-orange-500"
                      }`}
                    >
                      <Bookmark className={`h-4.5 w-4.5 ${isSaved ? "fill-orange-500" : ""} hover:scale-110 transition-transform`} />
                    </button>
                    
                    <Link
                      to={`/explore/${post.slug}`}
                      state={{ post }}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700 group-hover:underline underline-offset-4 transition-all"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Load more button - Social media style */}
      <div className="mt-12 text-center">
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-medium hover:bg-linear-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300 group">
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          Load More Stories
          <TrendingUp className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}