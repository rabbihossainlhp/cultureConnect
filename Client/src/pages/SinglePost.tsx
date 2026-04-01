import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, MessageCircle, Tag, ThumbsUp } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import type { PostItem } from "../constants/interface";
import { getPostListApiHandler } from "../services/api.service";

type LocationState = {
  post?: PostItem;
};

const toTitleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\w/g, (m) => m.toUpperCase());

function SinglePost() {
  const { slug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? null;

  const [post, setPost] = useState<PostItem | null>(locationState?.post ?? null);
  const [isLoading, setIsLoading] = useState(!locationState?.post);
  const [error, setError] = useState<string | null>(null);

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



  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-orange-50/40 via-white to-sky-50/50">
      <section className="max-w-4xl mx-auto">
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
          <article className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <img
              src={post.post_image || "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"}
              alt={post.title}
              className="h-64 w-full object-cover sm:h-80"
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
                <span className="inline-flex items-center gap-1.5">
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes} likes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments_count} comments
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-slate-700 leading-8 whitespace-pre-line">
                  {post.description || "No description available for this post."}
                </p>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}

export default SinglePost;
