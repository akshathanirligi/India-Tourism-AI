import { useMemo } from "react";
import { motion } from "framer-motion";
import { FiCoffee, FiCompass, FiMapPin, FiMoon, FiNavigation, FiSun } from "react-icons/fi";

const categoryPlans = [
  { matches: ["temple", "pilgrimage", "spiritual", "mosque", "church", "shrine"], morning: "Explore the heritage precinct", afternoon: "Discover local spiritual landmarks", evening: "Attend a peaceful evening ritual" },
  { matches: ["beach", "coast", "island"], morning: "Enjoy the shoreline and sea views", afternoon: "Explore the coastal promenade", evening: "Watch the sunset by the water" },
  { matches: ["wildlife", "sanctuary", "national park", "forest"], morning: "Join an early nature exploration", afternoon: "Visit the interpretation centre", evening: "Unwind with a nature walk" },
  { matches: ["waterfall", "river", "lake"], morning: "Visit the scenic waterside", afternoon: "Explore viewpoints and trails", evening: "Relax at a panoramic viewpoint" },
  { matches: ["hill", "mountain", "valley", "trek", "adventure"], morning: "Set out for the scenic viewpoint", afternoon: "Explore a local nature trail", evening: "Take in the hill-country sunset" },
];

const defaultPlan = { morning: "Explore the destination highlights", afternoon: "Discover local culture and nearby sights", evening: "Enjoy a relaxed local evening" };

function durationFromVisitTime(value) {
  const number = Number.parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) && number > 0 ? `${Math.min(Math.max(number, 1), 5)} hrs` : "2–3 hrs";
}

function TravelTimeline({ days, place, nearbyPlaces = [] }) {
  const itinerary = useMemo(() => {
    const totalDays = Math.min(Math.max(Number(days) || 1, 1), 14);
    const category = String(place?.category || "").toLowerCase();
    const plan = categoryPlans.find((item) => item.matches.some((match) => category.includes(match))) || defaultPlan;
    const nearby = nearbyPlaces.filter((item) => item?.placeName && item.placeId !== place?.placeId);
    const season = place?.bestSeason && place.bestSeason !== "Any time" ? `Best enjoyed during ${place.bestSeason}.` : "Leave room for the local pace and weather.";
    const visitDuration = durationFromVisitTime(place?.averageVisitTime);

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;
      const nearbyPlace = nearby[index % Math.max(nearby.length, 1)]?.placeName;
      const highlight = day === 1 ? `Visit ${place?.placeName || "your destination"}` : nearbyPlace ? `Visit ${nearbyPlace}` : day % 2 ? plan.afternoon : "Explore a local market or cultural stop";
      return {
        day,
        items: [
          { time: "8:00 AM", title: "Breakfast and day briefing", description: `Start with a local breakfast and check travel conditions. ${season}`, duration: "45 min", Icon: FiCoffee },
          { time: "9:30 AM", title: "Travel to the first attraction", description: `Make your way to ${day === 1 ? place?.placeName || "the destination" : nearbyPlace || "today's highlight"} with time for a comfortable arrival.`, duration: "30–60 min", Icon: FiNavigation },
          { time: "10:15 AM", title: day === 1 ? `Explore ${place?.placeName || "the main attraction"}` : plan.morning, description: day === 1 ? `${place?.description || "Take in the destination's main sights at an unhurried pace."}` : "Focus on the most rewarding sights before the afternoon crowds.", duration: visitDuration, Icon: FiCompass },
          { time: "1:30 PM", title: "Lunch and recharge", description: "Pause for a relaxed local meal before the afternoon activity.", duration: "60 min", Icon: FiCoffee },
          { time: "3:00 PM", title: highlight, description: nearbyPlace ? `Continue to ${nearbyPlace} or choose another nearby point of interest.` : plan.afternoon, duration: "2 hrs", Icon: FiMapPin },
          { time: "6:00 PM", title: plan.evening, description: "Finish the day with photos, a calm walk, and time to return to your stay.", duration: "1–2 hrs", Icon: day === totalDays ? FiMoon : FiSun },
        ],
      };
    });
  }, [days, nearbyPlaces, place]);

  return <section className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:mt-8 sm:p-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Plan at a glance</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">🗓 Travel Timeline</h2></div><p className="text-sm text-slate-600">A flexible, destination-aware daily rhythm</p></div><div className="mt-7 space-y-8">{itinerary.map(({ day, items }) => <motion.div key={day} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: Math.min(day * 0.06, 0.3) }}><div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-sm font-black text-white shadow-lg shadow-sky-600/20">{day}</span><div><h3 className="font-bold text-slate-900">Day {day}</h3><p className="text-xs font-medium text-slate-500">A balanced day of discovery</p></div></div><ol className="relative ml-5 border-l-2 border-sky-100 pl-7 sm:ml-6">{items.map(({ time, title, description, duration, Icon }) => <li key={`${day}-${time}`} className="relative pb-6 last:pb-0"><span className="absolute -left-[2.35rem] top-1 grid h-7 w-7 place-items-center rounded-full border-4 border-white bg-sky-600 text-white shadow-sm"><Icon className="h-3.5 w-3.5" /></span><article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/70 hover:shadow-md"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-sky-700">{time}</p><h4 className="mt-1 font-bold text-slate-900">{title}</h4></div><span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">{duration}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article></li>)}</ol></motion.div>)}</div></section>;
}

export default TravelTimeline;
