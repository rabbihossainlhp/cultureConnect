import { Link } from "react-router";
import type { CulturePost } from "../../types";

import {
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Tag,
  UserRound,
} from "lucide-react";






const culturePosts: CulturePost[] = [
  {
    id: 1,
    title: "Why Pohela Boishakh Still Matters to Bangladeshi Youth",
    excerpt:
      "Pohela Boishakh is more than a new year event. It is identity, color, music, and a reminder of cultural unity across generations.",
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
    excerpt:
      "In many homes, tea is a daily routine. In Kyoto, it can become a quiet lesson in attention, patience, and hospitality.",
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
    excerpt:
      "Learning simple local phrases helps you connect faster than translation apps. Here are practical expressions used in daily life.",
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
    excerpt:
      "Feijoada is not just a dish; it is shared memory, weekend gathering, and a symbol of community and resilience.",
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
    excerpt:
      "Traditional bazaars are living museums. Every shop, phrase, and negotiation style carries historical meaning.",
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
    excerpt:
      "Mispronunciations and grammar mistakes are not failures. They are often the fastest path to cultural connection.",
    country: "Global",
    category: "Language",
    author: "Sadia Noor",
    readTime: "4 min read",
    published: "Feb 28, 2026",
    likes: 214,
    comments: 58,
  },
];






export default function ExploreCard() {
  return (

      <section className="max-w-7xl mx-auto mt-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", "Tradition", "Food", "Language", "Festival", "History"].map((item) => (
            <button
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-orange-300 hover:text-orange-600"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {culturePosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  <Tag className="h-3.5 w-3.5" />
                  {post.category}
                </span>
                <span className="text-xs font-medium text-slate-500">{post.country}</span>
              </div>

              <h2 className="mt-3 text-lg font-bold leading-snug text-slate-800">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <p className="inline-flex items-center gap-1">
                  <UserRound className="h-3.5 w-3.5" />
                  {post.author}
                </p>
                <p className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readTime}
                </p>
                <p className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {post.published}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-4 w-4 text-pink-500" />
                    {post.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-orange-500" />
                    {post.comments}
                  </span>
                </div>

                <Link
                  to="#"
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
  )
}
