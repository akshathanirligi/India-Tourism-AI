import { FiCompass, FiMapPin, FiTrendingUp } from "react-icons/fi";
import SiteLayout from "../components/SiteLayout";

function About() {
  return <SiteLayout><main className="px-4 py-14 sm:px-6"><div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">About us</p><h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-slate-900">A calmer, clearer way to plan travel across India.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">India Tourism AI brings destination information, maps, local weather, nearby services and budget guidance together so planning feels less like research and more like anticipation.</p><div className="mt-12 grid gap-5 md:grid-cols-3">{[[FiCompass, "Thoughtful discovery", "Explore destinations before committing to a plan."], [FiMapPin, "Useful local context", "Keep navigation and essential nearby services close at hand."], [FiTrendingUp, "Practical planning", "Balance your itinerary with the time and budget you have."]].map(([Icon, title, text]) => <article key={title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><Icon className="h-7 w-7 text-sky-700" /><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-slate-600">{text}</p></article>)}</div></div></main></SiteLayout>;
}

export default About;
