import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Languages,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router";

const highlights = [
  { label: "Countries represented", value: "140+" },
  { label: "Community conversations", value: "20k+" },
  { label: "Live language rooms", value: "500+" },
  { label: "Weekly growth", value: "+18%" },
];

const features = [
  {
    icon: Users,
    title: "People-First Learning",
    description:
      "Meet speakers from different regions and learn context, tone, and cultural meaning from real conversation.",
  },
  {
    icon: Video,
    title: "Live Rooms",
    description:
      "Jump into themed public rooms or private circles to practice confidently in smaller, safer spaces.",
  },
  {
    icon: MessageCircle,
    title: "Direct Exchange",
    description:
      "Continue discussions with one-on-one messaging when you find someone with similar goals and interests.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated Community",
    description:
      "Community standards, account protection, and reporting tools help keep learning respectful and useful.",
  },
];

const steps = [
  {
    title: "Create your profile",
    text: "Share your language background, goals, and interests so the platform can recommend relevant people and rooms.",
  },
  {
    title: "Explore and join",
    text: "Browse cultural posts, join live rooms, and discover community discussions that match your curiosity.",
  },
  {
    title: "Practice consistently",
    text: "Build momentum through conversations, missions, and direct exchange that fits your schedule.",
  },
];

function Home() {
  return (
    <div className="relative overflow-hidden cc-home cc-page-offset">
      <div className="pointer-events-none absolute inset-0 cc-home-grid" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full cc-home-glow-primary blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full cc-home-glow-secondary blur-3xl" />

      <section className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-orange-100/80 px-4 py-2 text-xs font-semibold tracking-wide text-orange-900">
            <Sparkles className="h-4 w-4" />
            Built for real cultural connection
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Learn languages through
            <span className="cc-home-gradient-text"> real people </span>
            and real culture.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
            CultureConnect helps new learners and global communities meet in live rooms, posts, and direct chats. Start with curiosity and grow through conversation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/auth/signup"
              className="cc-btn cc-btn-primary rounded-full px-6 py-3"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/explore"
              className="cc-btn cc-btn-ghost rounded-full px-6 py-3"
            >
              Explore Community
              <Compass className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65 }}
          className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl backdrop-blur sm:p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22 + idx * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-2xl font-extrabold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-600">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Why people stay</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-900">
              "I joined for language practice and stayed for cultural friendships I could never get from apps alone."
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-xl bg-sky-100 p-2 text-sky-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-2 text-slate-900">
            <Languages className="h-5 w-5 text-orange-600" />
            <h3 className="text-2xl font-extrabold">How it works for new members</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="cc-home-cta rounded-3xl p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">Ready to begin?</p>
          <h4 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Your first cultural conversation is one click away.</h4>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cyan-50 sm:text-base">
            Create your account and join people learning with empathy, curiosity, and practical conversation.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/auth/signup"
              className="cc-btn rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create Account
            </Link>
            <Link
              to="/live-rooms"
              className="cc-btn rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Browse Live Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;