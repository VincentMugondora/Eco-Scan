import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, MapPin, ChevronLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import signUpBg from "../../assets/auth-signup.png";

const SignUp = ({ onSignUp, onNavigateToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="h-screen lg:h-screen h-[100dvh] bg-white flex flex-col lg:flex-row font-sans select-none overflow-hidden">
      {/* Visual Side (Left) - Only visible on LG screens and up */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0F172A] flex-col justify-end p-20 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={signUpBg} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Sustainability Visual"
        />
        
        {/* Abstract Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/30 to-transparent"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-[22px] flex items-center justify-center mb-8 shadow-xl">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 7.5a7 7 0 0 1-10 10.5z" />
            </svg>
          </div>
          <h1 className="text-[56px] font-black text-white mb-6 leading-[1] tracking-tighter">
            Build a <span className="text-[#10B981]">Greener</span> <br/> Future Today.
          </h1>
          <p className="text-[#94A3B8] text-[18px] font-medium max-w-md leading-relaxed">
            Every small action counts. Track your impact, reduce waste, and connect with a community that cares.
          </p>
          
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl max-w-xs">
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <span className="text-white text-[14px] font-bold">Secure & Private</span>
             </div>
             <p className="text-[#64748B] text-[12px] font-medium leading-relaxed">
               Your data is encrypted using military-grade protocols and stored in zero-emission data centers.
             </p>
          </div>
        </motion.div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        {/* Mobile Header (Hidden on LG) */}
        <div className="w-full max-w-md lg:hidden flex items-center justify-between mb-6 mt-2">
          <button 
             onClick={onNavigateToSignIn}
             className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <h2 className="text-[17px] font-bold text-[#0F172A]">Create Account</h2>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[480px]">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-[32px] font-black text-[#0F172A] mb-2 tracking-tight">Get Started</h2>
            <p className="text-[#64748B] text-[16px] font-medium">Create your eco-scan account in seconds.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                    <User className="w-4.5 h-4.5" strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full h-13 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-11 pr-4 text-[14px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest pl-1">Location</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                    <MapPin className="w-4.5 h-4.5" strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Paris, FR"
                    className="w-full h-13 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-11 pr-4 text-[14px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Email Address Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                  <Mail className="w-4.5 h-4.5" strokeWidth={2.5} />
                </div>
                <input 
                  type="email" 
                  placeholder="jane.doe@example.com"
                  className="w-full h-13 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-11 pr-4 text-[14px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#64748B] uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#107050] transition-colors">
                  <Lock className="w-4.5 h-4.5" strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a strong password"
                  className="w-full h-13 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-11 pr-11 text-[14px] font-bold text-[#0F172A] focus:outline-none focus:border-[#107050] focus:ring-1 focus:ring-[#107050] transition-all placeholder:text-[#94A3B8] placeholder:font-medium"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                  type="button"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex gap-4 px-1 mt-1 bg-[#F1F5F9]/50 p-4 rounded-2xl border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-[#CBD5E1] text-[#107050] focus:ring-[#107050] cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-[13px] font-medium text-[#64748B] leading-relaxed cursor-pointer select-none">
                I agree to the <button className="text-[#107050] font-bold hover:underline">Terms of Service</button> and acknowledge the 2026 Sustainability Privacy Policy.
              </label>
            </div>

            <button 
              onClick={onSignUp}
              className="w-full h-14 bg-[#107050] hover:bg-[#065A3F] text-white rounded-2xl text-[16px] font-black shadow-[0_8px_24px_-6px_rgba(16,112,80,0.4)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 group"
            >
              Create Account
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                 <ChevronLeft className="w-5 h-5 rotate-180" strokeWidth={3} />
              </motion.span>
            </button>

            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-[#E2E8F0]"></div>
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">Or join with</span>
              <div className="flex-1 h-px bg-[#E2E8F0]"></div>
            </div>

            <button className="w-full h-13 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="text-[15px] font-bold text-[#0F172A]">Sign up with Google</span>
            </button>
          </motion.div>

          <p className="mt-8 text-center text-[14px] font-medium text-[#64748B]">
            Already have an account? {" "}
            <button 
              onClick={onNavigateToSignIn}
              className="text-[#107050] font-black hover:underline underline-offset-4"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignUp };
