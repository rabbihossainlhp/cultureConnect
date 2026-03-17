import React, { useState } from "react";
import {AnimatePresence,motion} from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Globe, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { loginApiHandler } from "../../services/api.service";
import type { ToastState } from "../../types";





export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();



  const handleLogin = async (event:React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if(!password || !email){
      setToast({type:"error", message:"All fields are required!"});
      return;
    }
    if(password.length >28 || password.length <8){
      setToast({type:"error", message:"Passwrod must be betweeen 8-28 charecter."});
      return;
    }

    setIsLoading(true);
    try{
      const res = await loginApiHandler({email,password});
      navigate("/")

      console.log(res)
    }catch(err){
      setToast({type:"error", message: err instanceof Error? err.message : "Login failed!"});
    }
    setIsLoading(false);

  }




  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-orange-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      
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
                        ? "border-rose-300 bg-linear-to-r from-rose-50 to-orange-50 text-rose-800"
                        : "border-emerald-300 bg-linear-to-r from-emerald-50 to-lime-50 text-emerald-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current opacity-80" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {toast.type === "error" ? "Login Error" : "Success"}
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
      
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 rounded-full bg-pink-300/35 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-xs font-semibold tracking-widest text-orange-600">
            <Globe className="h-4 w-4" />
            CULTURECONNECT
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-800">
            Welcome Back
          </h1>
          <p className="mt-3 max-w-md text-slate-600">
            Rejoin your global community, continue cultural conversations, and
            explore new stories from around the world.
          </p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(236,72,153,0.35)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">Sign In</h2>
            <p className="mt-1 text-sm text-slate-500">
              Access your CultureConnect account
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                <Mail className="h-4 w-4 text-orange-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-200">
                <Lock className="h-4 w-4 text-orange-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a href="#" className="font-medium text-pink-600 hover:text-pink-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              {isLoading ? "Signing in...":"Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here?{" "}
            <Link to="/auth/signup" className="font-semibold text-orange-600 hover:text-orange-500">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}