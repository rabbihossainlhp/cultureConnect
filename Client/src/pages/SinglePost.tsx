import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Heart, MessageCircle, Send, Tag } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import type { PostItem } from "../constants/interface";
import { getPostListApiHandler, likeUnlikePostApiHandler, getPostCommentsApiHandler, addCommentApiHandler } from "../services/api.service";
import { useAuth } from "../contexts/AuthContext";

type LocationState = {
  post?: PostItem;
};

const toTitleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\w/g, (m) => m.toUpperCase());

function SinglePost() {
  const { user } = useAuth();
  const { slug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? null;

  const [post, setPost] = useState<PostItem | null>(locationState?.post ?? null);
  const [isLoading, setIsLoading] = useState(!locationState?.post);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes ?? 0);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const likedStorageKey = `likedPosts_${user?.id ?? "guest"}`;

  useEffect(() => {
    if (!slug) {
      setError("Invalid post link.");
      setIsLoading(false);
      return;
    }

    if (locationState?.post && locationState.post.slug === slug) {
      setPost(locationState.post);
      setIsLoading(false);
      return;
    }

    const loadSinglePost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPostListApiHandler();
        const foundPost = (response.data ?? []).find((item) => item.slug === slug);
        if (!foundPost) {
          setError("Post not found.");
          setPost(null);
          return;
        }
        setPost(foundPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post details.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSinglePost();
  }, [slug, locationState]);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes ?? 0);
      loadComments();
      try {
        const raw = localStorage.getItem(likedStorageKey);
        const liked = raw ? JSON.parse(raw) : [];
        setIsLiked(Array.isArray(liked) && liked.includes(post.id));
      } catch {
        setIsLiked(false);
      }
    }
  }, [post?.id, likedStorageKey]);

  const loadComments = async () => {
    if (!post) return;
    setLoadingComments(true);
    try {
      const res = await getPostCommentsApiHandler(post.id);
      setComments(res?.data ?? []);
    } catch (err) {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const res = await likeUnlikePostApiHandler(post.id);
      const count = res?.data?.likes_count ?? likesCount;
      const message = String(res?.message ?? "").toLowerCase();
      const likedFromServer = message.includes("liked") && !message.includes("unliked");
      setLikesCount(count);
      setIsLiked(likedFromServer);

      try {
        const raw = localStorage.getItem(likedStorageKey);
        const liked = raw ? JSON.parse(raw) : [];
        const next = new Set<number>(Array.isArray(liked) ? liked : []);
        if (likedFromServer) next.add(post.id);
        else next.delete(post.id);
        localStorage.setItem(likedStorageKey, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage errors
      }
    } catch (err) {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleAddComment = async () => {
    if (!post || !commentText.trim()) return;
    const text = commentText;
    setCommentText("");
    setPostingComment(true);

    try {
      const res = await addCommentApiHandler(post.id, text);
      const newComment = {
        ...(res?.data ?? res),
        username: (res?.data ?? res)?.username ?? user?.username ?? "You",
        profile_picture: (res?.data ?? res)?.profile_picture ?? user?.profile_picture ?? "",
      };
      setComments([newComment, ...comments]);
    } catch (err) {
      setCommentText(text);
    } finally {
      setPostingComment(false);
    }
  };



  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-orange-50/40 via-white to-sky-50/50">
      <section className="max-w-6xl mx-auto">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-8 text-center text-slate-500">
            Loading post...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && post ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Post Content - Left Side */}
            <article className="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <img
                src={post.post_image || "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"}
                alt={post.title}
                className="h-80 w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-semibold text-orange-700"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        {toTitleCase(tag)}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-semibold text-orange-700">
                      <Tag className="h-3.5 w-3.5" />
                      General
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl font-black leading-tight text-slate-800">
                  {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    {post.readtime || "3 min read"}
                  </span>
                </div>

                {/* Like & Comments Stats */}
                <div className="mt-4 flex items-center gap-6 border-y border-slate-200 py-3 text-sm">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      isLiked ? "text-pink-500" : "text-slate-600 hover:text-pink-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-pink-500" : ""}`} />
                    {likesCount} likes
                  </button>
                  <button className="flex items-center gap-2 font-medium text-slate-600 hover:text-orange-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    {comments.length} comments
                  </button>
                </div>

                <div className="mt-6">
                  <p className="text-slate-700 leading-8 whitespace-pre-line">
                    {post.description || "No description available for this post."}
                  </p>
                </div>
              </div>
            </article>

            {/* Comments Sidebar - Right Side */}
            <div className="lg:col-span-1 rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col h-fit sticky top-28">
              <div className="bg-linear-to-r from-orange-500 to-pink-500 px-6 py-4">
                <h3 className="text-white font-bold text-lg">Comments</h3>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto max-h-96 space-y-3 p-4">
                {loadingComments ? (
                  <div className="text-sm text-slate-500 text-center py-4">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-sm text-slate-500 text-center py-4">No comments yet. Be the first!</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-start gap-2.5">
                        {c.profile_picture ? (
                          <img
                            src={c.profile_picture}
                            alt={c.username ?? "User"}
                            className="h-8 w-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-linear-to-br from-orange-400 to-pink-400 shrink-0 flex items-center justify-center text-white text-xs font-bold">
                            {(c.username?.[0] ?? "U").toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 text-sm line-clamp-1">
                            {c.username ?? "Anonymous"}
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{c.content}</p>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(c.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="border-t border-slate-200 p-4 space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  rows={2}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || postingComment}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4" />
                  {postingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default SinglePost;
