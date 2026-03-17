import React, { useEffect, useState } from "react";
import {motion,AnimatePresence} from "framer-motion";
import { Eye, EyeOff, Globe, Globe2, Languages, Lock, Mail, UserRound , X} from "lucide-react";
import { Link, useNavigate } from "react-router";
import signupApiHandler from "../../services/api.service";


const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Japan",
];

const nativeLanguages = [
  "Bangla",
  "English",
  "Hindi",
  "Urdu",
  "Nepali",
  "Tamil",
  "Arabic",
  "Spanish",
  "French",
  "Japanese",
];


type ToastState = {
  type: "error" | "success";
  message:string;
};



export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [toast,setToast] = useState<ToastState | null>(null);
  const navigate = useNavigate();


  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      await signupApiHandler({
        username,email,country,
        nativeLanguage,password
      });

      navigate('/auth/login',{
        replace:true,
        state:{message:'Account created successfully.'}
      });
    }catch(err){
      setToast({
        type:"error",
        message:err instanceof Error ? err.message : "Signup Failed!"
      })
    }
  };




  useEffect(()=>{
    if(!toast) return;
    const timer = setTimeout(()=>setToast(null),3000);
    return ()=>clearTimeout(timer);
  },[toast])



  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      
      <div className="fixed right-4 top-4 z-50 w-[min(92vw,360px)]">
        <AnimatePresence>
          {toast && (
            <motion.div
              key="signup-toast"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
                toast.type === "error"
                  ? "border-rose-300 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-800"
                  : "border-emerald-300 bg-gradient-to-r from-emerald-50 to-lime-50 text-emerald-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current opacity-80" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {toast.type === "error" ? "Signup Error" : "Success"}
                  </p>
                  <p className="text-sm opacity-90">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <aside className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-xs font-semibold tracking-widest text-orange-600">
            <Globe className="h-4 w-4" />
            CULTURECONNECT
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-800">
            Meet the world,
            <br />
            one culture at a time.
          </h1>
          <p className="mt-3 max-w-md text-slate-600">
            Join CultureConnect and build meaningful cross-cultural friendships.
          </p>
        </aside>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(249,115,22,0.4)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">Create Your Account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start your journey with people from different cultures
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Username
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                  <UserRound className="h-4 w-4 text-orange-500" />
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Email
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Country
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Globe2 className="h-4 w-4 text-orange-500" />
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Native Language
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Languages className="h-4 w-4 text-orange-500" />
                  <select
                    value={nativeLanguage}
                    onChange={(event) => setNativeLanguage(event.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="">Select language</option>
                    {nativeLanguages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                <Lock className="h-4 w-4 text-orange-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Use at least 8 characters to keep your account secure.
              </p>
            </label>

            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300" />
              I agree to the Terms and Privacy Policy.
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-semibold text-pink-600 hover:text-pink-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
