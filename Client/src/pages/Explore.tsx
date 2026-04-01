import { useEffect, useMemo, useState } from "react";
import { BookOpenText, PencilLine, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import type { PostItem } from "../constants/interface";
import ExploreCard from "../components/common/ExploreCard";
import { createPostApiHandler, getPostListApiHandler } from "../services/api.service";
import type { Toast } from "../types";
import { calculateReadTime } from "../utils/helperUtility";





const initialFormState = {
  title: "",
  description: "",
  tags: "",
  slug: "",
};

function Explore() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [form, setForm] = useState(initialFormState);

  const postCount = useMemo(() => posts.length, [posts]);

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await getPostListApiHandler();
      setPosts(response.data ?? []);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to fetch posts",
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.tags.trim()) {
      setToast({ type: "error", message: "Title, description and tags are required." });
      return;
    }

    const tagsArray = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tagsArray.length === 0) {
      setToast({ type: "error", message: "Please provide at least one tag." });
      return;
    }

    const normalizedSlug = form.slug.trim() || slugify(form.title);
    if (!normalizedSlug) {
      setToast({ type: "error", message: "Unable to generate slug from title." });
      return;
    }

    const readtime = calculateReadTime(form.description);

    setIsSubmitting(true);
    try {
      await createPostApiHandler({
        title: form.title.trim(),
        description: form.description.trim(),
        tags: tagsArray,
        slug: normalizedSlug,
        readtime,

      });

      setToast({ type: "success", message: "Post created successfully." });
      setIsCreateOpen(false);
      setForm(initialFormState);
      await loadPosts();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Post creation failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-amber-50/40 via-white to-sky-50/60">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative max-w-7xl mx-auto">
        <div className="relative rounded-3xl backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl p-8 sm:p-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-400 via-pink-400 to-sky-400"></div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50/80 backdrop-blur-sm px-5 py-1.5 text-sm font-semibold tracking-wide text-orange-700 shadow-sm">
                <BookOpenText className="h-4 w-4" />
                CULTURE BLOG
                <span className="ml-1 flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
              </p>

              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 2.4k+ readers</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {postCount}+ stories</span>
              </div>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight bg-linear-to-r from-slate-800 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Explore Real Stories <br />
              <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">From Real Cultures</span>
            </h1>

            <p className="mt-5 max-w-2xl text-slate-600 text-lg leading-relaxed">
              Discover community-written posts about traditions, food, language, and festivals.
              CultureConnect turns cultural learning into shared stories.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <PencilLine className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Write a Culture Post
                  <Sparkles className="h-3.5 w-3.5 opacity-70" />
                </span>
              </button>
              <button
                onClick={() => void loadPosts()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 font-semibold hover:bg-white hover:border-orange-200 hover:text-orange-600 hover:shadow-md transition-all duration-300 group"
              >
                <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Refresh Posts
              </button>
            </div>
          </div>
        </div>
      </section>

      {toast ? (
        <div className="relative max-w-7xl mx-auto mt-6">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      {isCreateOpen ? (
        <section className="relative max-w-7xl mx-auto mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-5 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Create New Post</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm text-slate-700">
                Title
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Give your story a title"
                />
              </label>

              <label className="sm:col-span-2 text-sm text-slate-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Write your cultural story..."
                />
              </label>

              <label className="text-sm text-slate-700">
                Tags (comma separated)
                <input
                  value={form.tags}
                  onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="festival, bangladesh"
                />
              </label>

              <label className="text-sm text-slate-700">
                Slug (optional)
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="auto-generated-if-empty"
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-orange-500 to-pink-500 px-5 py-2.5 text-white font-semibold hover:brightness-105 disabled:opacity-60"
                >
                  <PencilLine className="h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      <ExploreCard posts={posts} isLoading={isLoadingPosts} />
    </main>
  );
}

export default Explore;
