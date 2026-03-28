import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import signInBg from "../../assets/auth-signin.png";
import { supabase } from "../../utils/supabaseClient";

const SignIn = ({ onSignIn, onNavigateToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignInSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      onSignIn(); // Let App.jsx handle navigation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen lg:h-screen h-[100dvh] bg-white flex flex-col lg:flex-row font-sans select-none overflow-hidden">
      {/* Visual Side (Left) - Only visible on LG screens and up */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] flex-col justify-end p-20 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={signInBg} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Sustainability Visual"
        />
        
        {/* Abstract Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/40 to-transparent"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10"
        >
          <div className="w-16 h-16 bg-[#107050] rounded-[22px] flex items-center justify-center mb-8 shadow-xl rotate-[-6deg]">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 7.5a7 7 0 0 1-10 10.5z" />
              <path d="M17 19.4c0-1.8-1.5-2.8-2.5-3.4" />
            </svg>
          </div>
          <h1 className="text-[64px] font-black text-white mb-6 leading-[0.9] tracking-tighter">
            Join the <span className="text-[#10B981]">Green</span> <br/> Revolution.
          </h1>
          <p className="text-[#94A3B8] text-[20px] font-medium max-w-md leading-relaxed">
            Your journey toward a zero-waste lifestyle starts with a single scan. Join 50k+ eco-warriors today.
          </p>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0F172A] bg-gray-200 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-white text-[14px] font-bold">
              <span className="text-[#10B981]">12k+</span> items scanned today
            </p>
          </div>
        </motion.div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Mobile Header (Hidden on LG) */}
        <div className="w-full max-w-md lg:hidden flex items-center justify-between mb-8 mt-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-md">
             <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 7.5a7 7 0 0 1-10 10.5z" />
             </svg>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[32px] font-black text-[#0F172A] mb-2">Welcome Back!</h2>
            <p className="text-[#64748B] text-[16px] font-medium">Please enter your details to sign in.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nature.lover@example.com"
                  className="w-full h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-12 pr-4 text-[15px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest">Password</label>
                <button className="text-[12px] font-bold text-[#107050] hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-12 pr-12 text-[15px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl border border-red-100 mt-2">
                {error}
              </div>
            )}

            <button 
              onClick={handleSignInSubmit}
              disabled={loading}
              className="w-full h-14 bg-[#107050] hover:bg-[#065A3F] disabled:opacity-70 disabled:hover:bg-[#107050] text-white rounded-2xl text-[16px] font-black shadow-[0_8px_24px_-6px_rgba(16,112,80,0.4)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-[#E2E8F0]"></div>
              <span className="text-[11px] font-black text-[#94A3B8] uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-[#E2E8F0]"></div>
            </div>

            <button className="w-full h-14 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="text-[15px] font-bold text-[#0F172A]">Sign in with Google</span>
            </button>
          </motion.div>

          <p className="mt-8 text-center text-[14px] font-medium text-[#64748B]">
            Don't have an account? {" "}
            <button 
              onClick={onNavigateToSignUp}
              className="text-[#107050] font-black hover:underline underline-offset-4"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignIn };
