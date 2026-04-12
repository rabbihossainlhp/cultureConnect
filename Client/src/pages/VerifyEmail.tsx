import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, X, ChevronLeft } from "lucide-react";
import { verifyOtpApiHandler } from "../services/api.service";
import { useAuth } from "../contexts/AuthContext";
import type { ToastState } from "../types";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAuth } = useAuth();

  // Get email from navigation state
  const email = (location.state as { email?: string })?.email || "";

  // Redirect if no email in state (user didn't come from signup)
  useEffect(() => {
    if (!email) {
      navigate("/auth/signup", { replace: true });
    }
  }, [email, navigate]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setToast({
        type: "error",
        message: "Please enter all 6 digits",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtpApiHandler({
        email,
        otp: otpCode,
      });

      // Refresh auth to update context with user data
      await refreshAuth();

      setToast({
        type: "success",
        message: "Email verified! Redirecting...",
      });

      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed";
      setToast({
        type: "error",
        message: errorMessage,
      });
      setIsLoading(false);
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  // Resend OTP (optional - for future implementation)
  const handleResend = () => {
    setToast({
      type: "error",
      message: "Resend feature coming soon",
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-purple-50 via-white to-blue-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      <div className="fixed right-4 top-4 z-50 w-[min(92vw,360px)]">
        <AnimatePresence>
          {toast && (
            <motion.div
              key="verify-toast"
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
                    {toast.type === "error" ? "Verification Error" : "Success"}
                  </p>
                  <p className="text-sm opacity-90">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Gradients */}
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-64 w-64 rounded-full bg-blue-300/35 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left Side - Info */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-1 text-xs font-semibold tracking-widest text-purple-600">
            <Globe className="h-4 w-4" />
            CULTURECONNECT
          </div>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-800">
            Verify Your Email
          </h1>
          <p className="mt-3 max-w-md text-slate-600">
            We've sent a 6-digit verification code to your email. Enter it
            below to complete your registration.
          </p>
          <div className="mt-8 space-y-4 text-sm text-slate-600">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                1
              </span>
              <span>Check your email</span>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                2
              </span>
              <span>Enter the 6-digit code</span>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                3
              </span>
              <span>Get instant access</span>
            </div>
          </div>
        </div>

        {/* Right Side - Verification Card */}
        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(168,85,247,0.35)] backdrop-blur-sm sm:p-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/auth/signup", { replace: true })}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Signup
          </button>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">
              Enter OTP Code
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              We sent a code to {email || "your email"}
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="mb-8 space-y-6">
            <div className="flex justify-center gap-3 lg:justify-start">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-12 rounded-lg border-2 border-slate-300 bg-white text-center text-2xl font-bold text-slate-800 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              ))}
            </div>

            <p className="text-center text-xs text-slate-500 lg:text-left">
              Code expires in{" "}
              <span className="font-semibold text-slate-700">10 minutes</span>
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend Option */}
          <div className="mt-6 flex items-center justify-between text-center">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="px-3 text-sm text-slate-600">
              Didn't get the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-purple-600 hover:text-purple-500"
              >
                Resend
              </button>
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
