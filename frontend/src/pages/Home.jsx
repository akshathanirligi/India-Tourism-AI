import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCloud, FiCoffee, FiCompass, FiDollarSign, FiHeart, FiMap, FiMapPin, FiNavigation, FiUsers } from "react-icons/fi";
import { FaPlaneDeparture, FaRobot } from "react-icons/fa6";
import DestinationImage from "../components/DestinationImage";
import SearchBar from "../components/SearchBar";
import SiteLayout from "../components/SiteLayout";

const popularDestinations = [
  { placeName: "Taj Mahal", state: "Uttar Pradesh", category: "Monument", rating: "4.9" },
  { placeName: "Munnar", state: "Kerala", category: "Hill Station", rating: "4.8" },
  { placeName: "Meenakshi Temple", state: "Tamil Nadu", category: "Temple", rating: "4.8" },
  { placeName: "Baga Beach", state: "Goa", category: "Beach", rating: "4.7" },
];

const categories = [
  { icon: "🏞", title: "Waterfalls", detail: "Chasing misty cascades", color: "from-cyan-500 to-blue-700" },
  { icon: "🛕", title: "Temples", detail: "Sacred stories and art", color: "from-orange-400 to-rose-600" },
  { icon: "🏖", title: "Beaches", detail: "Slow sunsets and shores", color: "from-sky-400 to-indigo-600" },
  { icon: "🌄", title: "Hill Stations", detail: "Cool air and wide views", color: "from-emerald-400 to-teal-700" },
  { icon: "🏛", title: "Heritage", detail: "India's timeless landmarks", color: "from-amber-400 to-orange-700" },
  { icon: "🐅", title: "Wildlife", detail: "Into the untamed wild", color: "from-lime-500 to-green-800" },
];

const features = [
  { icon: FaRobot, title: "AI Trip Planner", copy: "Build a focused itinerary around your time, interests and budget.", color: "text-violet-700 bg-violet-50" },
  { icon: FiNavigation, title: "Smart Navigation", copy: "Get clear directions and route-ready destination details.", color: "text-sky-700 bg-sky-50" },
  { icon: FiCloud, title: "Live Weather", copy: "Plan confidently around current conditions at your destination.", color: "text-cyan-700 bg-cyan-50" },
  { icon: FiHeart, title: "Nearby Essential Services", copy: "Find practical local services when you need them most.", color: "text-rose-700 bg-rose-50" },
  { icon: FiDollarSign, title: "Budget Estimation", copy: "Understand trip costs before you start packing.", color: "text-emerald-700 bg-emerald-50" },
  { icon: FiCoffee, title: "Hotels & Restaurants", copy: "Discover stay and dining options for a smoother journey.", color: "text-amber-700 bg-amber-50" },
  { icon: FaPlaneDeparture, title: "Travel Booking Hub", copy: "Move from a plan to bookings for travel and accommodation.", color: "text-blue-700 bg-blue-50" },
];

const counters = [{ value: 500, suffix: "+", label: "Tourist Places", icon: FiMapPin }, { value: 30, suffix: "+", label: "States & UTs", icon: FiCompass }, { value: 1000, suffix: "+", label: "Happy Travelers", icon: FiUsers }];

function SectionHeading({ eyebrow, title, copy, action }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{eyebrow}</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>{copy && <p className="mt-3 text-base leading-7 text-slate-600">{copy}</p>}</div>{action}</div>;
}

function AnimatedCounter({ value, suffix, label, icon: Icon }) {
  const [count, setCount] = useState(0);
  useEffect(() => { let frame; const started = performance.now(); const tick = (now) => { const progress = Math.min((now - started) / 1100, 1); setCount(Math.round(value * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [value]);
  return <div className="flex items-center justify-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sky-200"><Icon /></span><div><p className="text-2xl font-bold sm:text-3xl">{count}{suffix}</p><p className="text-sm text-sky-100">{label}</p></div></div>;
}

function Home() {
  return <SiteLayout><main className="overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50">
    <section className="relative isolate min-h-[760px] overflow-hidden px-4 pb-16 pt-20 text-white sm:px-6 sm:pt-28">
      <img src="https://images.unsplash.com/photo-1523544545175-92e04b96d26b?auto=format&fit=crop&w=2200&q=90" alt="Misty mountain landscape in India" className="absolute inset-0 -z-30 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-20 bg-slate-950/75" /><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(14,165,233,.35),transparent_30%),linear-gradient(105deg,rgba(2,6,23,.96),rgba(2,6,23,.68),rgba(2,6,23,.3))]" />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="inline-flex items-center gap-2 rounded-full border border-sky-200/30 bg-slate-950/35 px-4 py-2 text-sm font-bold tracking-[0.12em] text-sky-100 backdrop-blur"><FiCompass /> 🇮🇳 INDIA TOURISM AI</p><h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">Explore Incredible <span className="text-sky-300">India</span> with AI</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">Plan smarter, travel better. Discover amazing destinations, weather, nearby services and budget-friendly trips powered by AI.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/planner" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-xl"><FiCompass /> Plan My Trip <FiArrowRight /></Link><Link to="/destinations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"><FiMap /> Explore Destinations</Link></div></div><div className="mt-12"><SearchBar /></div></motion.div>
    </section>

    <section className="relative -mt-1 bg-slate-950 px-4 py-8 text-white sm:px-6"><div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">{counters.map((counter) => <AnimatedCounter key={counter.label} {...counter} />)}</div></section>

    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><SectionHeading eyebrow="Handpicked for you" title="🔥 Popular Destinations" copy="Start with the places travelers return to again and again." action={<Link to="/destinations" className="inline-flex items-center gap-2 font-bold text-sky-700 transition hover:gap-3 hover:text-sky-900">View all destinations <FiArrowRight /></Link>} /><div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{popularDestinations.map((place, index) => <motion.article key={place.placeName} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-200/50"><div className="h-52 overflow-hidden"><DestinationImage place={place} /></div><div className="p-5"><div className="flex items-start justify-between gap-2"><div><span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">{place.category}</span><h3 className="mt-3 text-xl font-bold text-slate-900">{place.placeName}</h3></div><span className="rounded-full bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700">★ {place.rating}</span></div><p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600"><FiMapPin className="text-sky-700" /> {place.state}</p><Link to="/destinations" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-700">Explore <FiArrowRight /></Link></div></motion.article>)}</div></section>

    <section className="bg-white px-4 py-20 sm:px-6"><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="Made for effortless travel" title="✨ Why Choose India Tourism AI" copy="Everything you need to turn a travel idea into a trip you can confidently take." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{features.map(({ icon: Icon, title, copy, color }, index) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${color}`}><Icon /></span><h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></motion.article>)}</div></div></section>

    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><SectionHeading eyebrow="Find your travel mood" title="🌍 Explore by Category" copy="From sacred spaces to wild landscapes, choose the kind of India you want to experience." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => <motion.div key={category.title} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06 }}><Link to="/destinations" className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${category.color} p-7 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}><span className="absolute -right-5 -top-9 text-8xl opacity-20 transition duration-300 group-hover:scale-110">{category.icon}</span><p className="relative text-4xl">{category.icon}</p><h3 className="relative mt-10 text-2xl font-bold">{category.title}</h3><p className="relative mt-2 text-white/80">{category.detail}</p><span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold">Explore <FiArrowRight /></span></Link></motion.div>)}</div></section>

    <section className="px-4 pb-20 sm:px-6"><div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-sky-800 p-8 text-white shadow-2xl sm:p-12"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-200">Your next story starts here</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Let AI take the stress out of planning.</h2><p className="mt-4 text-slate-200">Choose your destination, set your budget, and create a trip that feels made for you.</p><Link to="/planner" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-sky-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50">Start planning <FiArrowRight /></Link></div></div></section>
  </main></SiteLayout>;
}

export default Home;
