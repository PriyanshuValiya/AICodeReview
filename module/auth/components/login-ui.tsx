"use client";

import { signIn } from "@/lib/auth-client";
import { GithubIcon, Zap } from "lucide-react"; 
import { useState } from "react";

function LoginUI() {
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Error during GitHub sign-in:", error);
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      
      <div 
        className="
          w-full max-w-md p-8 sm:p-10 bg-white shadow-xl rounded-2xl 
          border border-gray-100 
          transition-all duration-300 hover:shadow-2xl hover:border-blue-100
        "
      >
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4 p-3 rounded-full bg-blue-50 text-blue-600">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            AI Code Reviewer
          </h1>
          <p className="mt-2 text-gray-500">
            Sign in to unleash the power of AI on your codebase.
          </p>
        </div>
        
        <div className="space-y-4">
          
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className={`
              w-full flex items-center justify-center px-4 py-3 rounded-xl 
              text-base font-semibold transition-all duration-300
              ${loading 
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100'
              }
            `}
          >
            {loading ? (
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <GithubIcon className="h-5 w-5 mr-3" />
            )}
            
            {loading ? 'Connecting to GitHub...' : 'Sign in with GitHub'}
          </button>
          
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          By signing in, you agree to our <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-150">Terms of Service</a>.
        </div>
        
      </div>
    </div>
  );
}

export default LoginUI;