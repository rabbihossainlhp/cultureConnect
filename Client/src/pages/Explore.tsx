import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpenText, Image as ImageIcon, PencilLine, Search, Sparkles, TrendingUp, Users, X } from "lucide-react";
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
  image: null as File | null,
};

function Explore() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Please select a valid image file." });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Image size must be less than 5MB." });
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("tags", JSON.stringify(tagsArray));
      formData.append("slug", normalizedSlug);
      formData.append("readtime", readtime);
      
      if (form.image) {
        formData.append("image", form.image);
      }

      await createPostApiHandler(formData);

      setToast({ type: "success", message: "Post created successfully." });
      setIsCreateOpen(false);
      setForm(initialFormState);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
    <main className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-amber-50/40 via-white to-sky-50/60 cc-page-offset">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-400 via-pink-400 to-sky-400"></div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50/80 px-5 py-1.5 text-sm font-semibold tracking-wide text-orange-700 shadow-sm backdrop-blur-sm">
                  <BookOpenText className="h-4 w-4" />
                  CULTURE BLOG
                  <span className="ml-1 flex h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
                </p>

                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 2.4k+ readers</span>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {postCount}+ stories</span>
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
                Explore Real Stories <br />
                <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">From Real Cultures</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Discover community-written posts about traditions, food, language, and festivals.
                CultureConnect turns cultural learning into shared stories.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-orange-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-300/30 active:scale-95"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative flex items-center gap-2">
                    <PencilLine className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    Write a Culture Post
                    <Sparkles className="h-3.5 w-3.5 opacity-70" />
                  </span>
                </button>
                <button
                  onClick={() => void loadPosts()}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white/60 px-6 py-3 font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-orange-200 hover:bg-white hover:text-orange-600 hover:shadow-md"
                >
                  <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Refresh Posts
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/80 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.45)]">
              <img
                src="/images/hero_world_map.jpg"
                alt="CultureConnect world map"
                className="h-72 w-full object-cover sm:h-80 lg:h-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.25em] text-white/75">Explore globally</p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  Stories, languages, and communities connected across the world.
                </p>
              </div>
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

              {/* Image Upload Section */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Post Image (optional)
                </label>
                
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 font-medium">Click to upload image</p>
                      <p className="text-xs text-slate-500">PNG, JPG, JPEG, WEBP up to 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

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
