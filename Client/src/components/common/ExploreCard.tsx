// ExploreCard.tsx
import { Link } from "react-router";
import type { CulturePost } from "../../types";
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
import { useState } from "react";

const culturePosts: CulturePost[] = [
  {
    id: 1,
    title: "Why Pohela Boishakh Still Matters to Bangladeshi Youth",
    excerpt: "Pohela Boishakh is more than a new year event. It is identity, color, music, and a reminder of cultural unity across generations.",
    country: "Bangladesh",
    category: "Festival",
    author: "Rafi Ahmed",
    readTime: "5 min read",
    published: "Mar 10, 2026",
    likes: 182,
    comments: 37,
  },
  {
    id: 2,
    title: "A Family Tea Ritual in Kyoto and What It Teaches About Respect",
    excerpt: "In many homes, tea is a daily routine. In Kyoto, it can become a quiet lesson in attention, patience, and hospitality.",
    country: "Japan",
    category: "Tradition",
    author: "Aiko Tanaka",
    readTime: "4 min read",
    published: "Mar 08, 2026",
    likes: 146,
    comments: 24,
  },
  {
    id: 3,
    title: "Street Arabic Phrases Every Traveler Should Learn",
    excerpt: "Learning simple local phrases helps you connect faster than translation apps. Here are practical expressions used in daily life.",
    country: "Morocco",
    category: "Language",
    author: "Youssef El Idrissi",
    readTime: "6 min read",
    published: "Mar 06, 2026",
    likes: 203,
    comments: 49,
  },
  {
    id: 4,
    title: "Brazilian Home Cooking: The Story Behind Feijoada",
    excerpt: "Feijoada is not just a dish; it is shared memory, weekend gathering, and a symbol of community and resilience.",
    country: "Brazil",
    category: "Food",
    author: "Marina Costa",
    readTime: "5 min read",
    published: "Mar 04, 2026",
    likes: 167,
    comments: 31,
  },
  {
    id: 5,
    title: "How Turkish Bazaars Preserve Social History",
    excerpt: "Traditional bazaars are living museums. Every shop, phrase, and negotiation style carries historical meaning.",
    country: "Turkey",
    category: "History",
    author: "Emre Kaya",
    readTime: "7 min read",
    published: "Mar 02, 2026",
    likes: 119,
    comments: 22,
  },
  {
    id: 6,
    title: "Language Exchange Mistakes That Actually Build Confidence",
    excerpt: "Mispronunciations and grammar mistakes are not failures. They are often the fastest path to cultural connection.",
    country: "Global",
    category: "Language",
    author: "Sadia Noor",
    readTime: "4 min read",
    published: "Feb 28, 2026",
    likes: 214,
    comments: 58,
  },
];

// Category colors mapping for better visual distinction
const categoryColors: Record<string, string> = {
  Tradition: "from-emerald-500 to-teal-500",
  Food: "from-amber-500 to-orange-500",
  Language: "from-sky-500 to-blue-500",
  Festival: "from-rose-500 to-pink-500",
  History: "from-indigo-500 to-purple-500",
};

export default function ExploreCard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const filters = ["All", "Tradition", "Food", "Language", "Festival", "History"];
  
  const filteredPosts = activeFilter === "All" 
    ? culturePosts 
    : culturePosts.filter(post => post.category === activeFilter);

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
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === item
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md shadow-orange-200 scale-105"
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

      {/* Posts Grid with enhanced cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const isSaved = savedPosts.includes(post.id);
          const gradientColor = categoryColors[post.category] || "from-slate-500 to-gray-500";
          
          return (
            <article
              key={post.id}
              className="group relative rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Category gradient bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradientColor}`}></div>
              
              <div className="p-5">
                {/* Header with category and country */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${gradientColor}/10 px-3 py-1 text-xs font-semibold text-slate-700 border border-white/50`}>
                    <Tag className="h-3.5 w-3.5" />
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {post.country}
                  </div>
                </div>

                {/* Title */}
                <h2 className="mt-4 text-xl font-bold leading-tight text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {post.title}
                </h2>
                
                {/* Excerpt */}
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" />
                    {post.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {post.published}
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
                      <span className="font-medium">{post.comments}</span>
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
                      to="#"
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
        <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-medium hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300 group">
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          Load More Stories
          <TrendingUp className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}

// Add missing imports
import { TrendingUp, Sparkles } from "lucide-react";