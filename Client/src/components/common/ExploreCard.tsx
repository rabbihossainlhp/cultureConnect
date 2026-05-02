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
import { useEffect, useMemo, useState } from "react";
import type { PostItem } from "../../constants/interface";
import { likeUnlikePostApiHandler, getPostCommentsApiHandler, addCommentApiHandler } from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";

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
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const likedStorageKey = `likedPosts_${user?.id ?? "guest"}`;
  const [likedPosts, setLikedPosts] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(likedStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [likesMap, setLikesMap] = useState<Record<number, number>>({});
  const [commentsOpen, setCommentsOpen] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});

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
    // optimistic toggle locally then sync with server
    const isLiked = likedPosts.includes(postId);
    setLikedPosts(prev => (isLiked ? prev.filter(id => id !== postId) : [...prev, postId]));

    // update likesMap optimistically
    setLikesMap(prev => ({ ...(prev || {}), [postId]: (prev[postId] ?? posts.find(p=>p.id===postId)?.likes ?? 0) + (isLiked ? -1 : 1) }));

    likeUnlikePostApiHandler(postId).then((res) => {
      const payload = res?.data ?? res;
      const likesCount = payload?.likes_count ?? payload?.likesCount ?? payload?.likes?.length ?? null;
      const message = String(res?.message ?? payload?.message ?? "").toLowerCase();
      const likedFromServer = message.includes("liked") && !message.includes("unliked");
      if (likesCount !== null) {
        setLikesMap(prev => ({ ...(prev||{}), [postId]: likesCount }));
      }
      setLikedPosts((prev) => {
        const has = prev.includes(postId);
        if (likedFromServer && !has) return [...prev, postId];
        if (!likedFromServer && has) return prev.filter((id) => id !== postId);
        return prev;
      });
    }).catch(() => {
      // rollback optimistic
      setLikedPosts(prev => (isLiked ? [...prev, postId] : prev.filter(id=>id!==postId)));
      setLikesMap(prev => ({ ...(prev||{}), [postId]: (prev[postId] ?? posts.find(p=>p.id===postId)?.likes ?? 0) }));
    });
  };

  const toggleComments = async (postId: number) => {
    const isOpen = !!commentsOpen[postId];
    if (isOpen) {
      setCommentsOpen(prev => ({ ...prev, [postId]: false }));
      return;
    }

    setCommentsOpen(prev => ({ ...prev, [postId]: true }));
    // lazy load comments
    if (!commentsMap[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const res = await getPostCommentsApiHandler(postId);
        const data = res?.data ?? res;
        setCommentsMap(prev => ({ ...prev, [postId]: data ?? [] }));
      } catch (err) {
        setCommentsMap(prev => ({ ...prev, [postId]: [] }));
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    const value = (commentInputs[postId] || "").trim();
    if (!value) return;
    try {
      const res = await addCommentApiHandler(postId, value);
      const added = res?.data ?? res;
      const hydratedComment = {
        ...added,
        username: added?.username ?? user?.username ?? "You",
        profile_picture: added?.profile_picture ?? user?.profile_picture ?? "",
      };
      setCommentsMap(prev => ({ ...(prev||{}), [postId]: [hydratedComment, ...(prev[postId] || [])] }));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      // ignore for now, optionally show toast
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(likedStorageKey);
      setLikedPosts(raw ? JSON.parse(raw) : []);
    } catch {
      setLikedPosts([]);
    }
  }, [likedStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(likedStorageKey, JSON.stringify(likedPosts));
    } catch {
      // ignore storage errors
    }
  }, [likedPosts, likedStorageKey]);

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
          const currentLikes = likesMap[post.id] ?? post.likes ?? 0;
          const currentCommentsCount = commentsMap[post.id]?.length ?? post.comments_count ?? 0;
          
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
                      <span className="font-medium">{currentLikes}</span>
                    </button>
                    
                    {/* Comment button */}
                    <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-500 transition-colors">
                      <MessageCircle className="h-4.5 w-4.5 hover:scale-110 transition-transform" />
                      <span className="font-medium">{currentCommentsCount}</span>
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
                {/* Comments pane - responsive small box */}
                {commentsOpen[post.id] ? (
                  <div className="mt-3 border-t pt-3">
                    {loadingComments[post.id] ? (
                      <div className="text-sm text-slate-500">Loading comments...</div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-auto">
                        {(commentsMap[post.id] || []).slice(0,5).map((c:any)=> (
                          <div key={c.id} className="flex items-start gap-3">
                            {c.profile_picture ? (
                              <img
                                src={c.profile_picture}
                                alt={c.username ?? "User"}
                                className="h-7 w-7 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-linear-to-br from-orange-400 to-pink-400 shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                                {(c.username?.[0] ?? "U").toUpperCase()}
                              </div>
                            )}
                            <div className="text-sm">
                              <div className="font-medium text-slate-800 line-clamp-1">{c.username ?? 'User'}</div>
                              <div className="text-slate-600 text-sm line-clamp-2">{c.content}</div>
                            </div>
                          </div>
                        ))}
                        {(commentsMap[post.id] || []).length === 0 ? (
                          <div className="text-sm text-slate-500">No comments yet. Be the first to comment.</div>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        value={commentInputs[post.id] ?? ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                      />
                      <button onClick={() => handleAddComment(post.id)} className="inline-flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg text-sm">Post</button>
                    </div>
                  </div>
                ) : null}
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