import { motion } from "framer-motion";
import AiPlannerAssistant from "../components/AiPlannerAssistant";
import SiteLayout from "../components/SiteLayout";

function Planner() {
  return <SiteLayout><main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50/40 px-4 py-10 sm:px-6 sm:py-14"><div className="mx-auto max-w-6xl"><motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-sky-900/15 sm:px-10 sm:py-12"><div className="absolute -right-12 -top-20 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" /><div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" /><div className="relative max-w-2xl"><p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-sky-100 backdrop-blur">🤖 AI Travel Planner</p><h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Plan Your Perfect Journey with AI</h1><p className="mt-5 text-lg leading-8 text-slate-300">Tell us about your trip and let AI create the perfect travel plan.</p></div></motion.section><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .1 }} className="mt-7"><AiPlannerAssistant /></motion.div></div></main></SiteLayout>;
}

export default Planner;
