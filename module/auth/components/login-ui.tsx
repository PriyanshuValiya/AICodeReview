"use client";

import type React from "react";

import { useState } from "react";
import { Mail, Lock, Github, Rat } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log("Sign in with:", { email, password });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Error during GitHub sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12">
        <div className="w-full max-w-2xl">
          <AIIllustration />
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-x-3">
              <Rat className="h-16 w-16 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mt-2">
                CodeRat
              </h1>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSignIn}
            className="space-y-5 animate-fade-in-delay"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center ${
                loading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* GitHub Sign In */}
          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center border-2 cursor-pointer ${
              loading
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
            }`}
          >
            <Github className="h-5 w-5 mr-2" />
            Continue with GitHub
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDelay {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          20% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeInDelay 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

function AIIllustration() {
  return (
    <div className="space-y-8 text-center">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-auto max-w-sm mx-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central node */}
        <circle cx="100" cy="100" r="40" fill="#1e40af" opacity="0.1" />
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="none"
          stroke="#1e40af"
          strokeWidth="2"
        />
        <circle cx="100" cy="100" r="8" fill="#1e40af" />

        {/* Surrounding nodes */}
        <circle cx="160" cy="100" r="6" fill="#3b82f6" opacity="0.6" />
        <circle cx="40" cy="100" r="6" fill="#3b82f6" opacity="0.6" />
        <circle cx="100" cy="160" r="6" fill="#3b82f6" opacity="0.6" />
        <circle cx="100" cy="40" r="6" fill="#3b82f6" opacity="0.6" />

        {/* Diagonal nodes */}
        <circle cx="142" cy="142" r="6" fill="#3b82f6" opacity="0.4" />
        <circle cx="58" cy="58" r="6" fill="#3b82f6" opacity="0.4" />
        <circle cx="142" cy="58" r="6" fill="#3b82f6" opacity="0.4" />
        <circle cx="58" cy="142" r="6" fill="#3b82f6" opacity="0.4" />

        {/* Connecting lines */}
        <line
          x1="100"
          y1="100"
          x2="160"
          y2="100"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="100"
          y1="100"
          x2="40"
          y2="100"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="160"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </svg>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 italic">
          AI Intelligent Code Reviewer
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Powered by advanced AI to analyze, review, and improve your code in
          seconds
        </p>
      </div>
    </div>
  );
}
