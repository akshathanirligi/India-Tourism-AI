import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiHeart, FiMapPin, FiSearch, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DestinationImage from "../components/DestinationImage";
import SiteLayout from "../components/SiteLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const categoryFilters = [
  { id: "all", label: "All destinations" }, { id: "waterfall", label: "🏞 Waterfalls" }, { id: "temple", label: "🛕 Temples" }, { id: "beach", label: "🏖 Beaches" }, { id: "hill", label: "🌄 Hill Stations" }, { id: "wildlife", label: "🐅 Wildlife" }, { id: "heritage", label: "🏛 Heritage" }, { id: "park", label: "🌳 Parks" },
];

const getCategoryKey = (category = "") => {
  const value = category.toLowerCase();
  if (value.includes("waterfall")) return "waterfall";
  if (value.includes("temple") || value.includes("pilgrimage") || value.includes("mosque")) return "temple";
  if (value.includes("beach") || value.includes("coast") || value.includes("island")) return "beach";
  if (value.includes("hill") || value.includes("mountain") || value.includes("valley") || value.includes("peak")) return "hill";
  if (value.includes("wildlife") || value.includes("sanctuary")) return "wildlife";
  if (value.includes("park") || value.includes("garden")) return "park";
  if (value.includes("heritage") || value.includes("fort") || value.includes("palace") || value.includes("monument") || value.includes("architecture")) return "heritage";
  return "default";
};

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedTrips, setSavedTrips] = useState([]);
  const [savingPlaceId, setSavingPlaceId] = useState("");
  const [, setSaveError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let active = true;
    async function loadDestinations() {
      try {
        const { data: states } = await api.get("/states");
        const districtGroups = await Promise.all((Array.isArray(states) ? states : []).map(async (state) => ({ state, districts: (await api.get(`/districts/${state.stateId}`)).data })));
        const placeGroups = await Promise.all(districtGroups.flatMap(({ state, districts }) => (Array.isArray(districts) ? districts : []).map(async (district) => ({ state, district, places: (await api.get(`/tourist-places/${district.districtId}`)).data }))));
        if (active) setDestinations(placeGroups.flatMap(({ state, district, places }) => (Array.isArray(places) ? places : []).map((place) => ({ ...place, stateName: state.stateName, districtName: district.districtName }))));
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDestinations();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isAuthenticated) api.get("/saved-trips").then(({ data }) => setSavedTrips(Array.isArray(data) ? data : [])).catch(() => setSavedTrips([]));
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return destinations.filter((place) => {
      const matchesQuery = !term || [place.placeName, place.category, place.districtName, place.stateName].some((value) => String(value || "").toLowerCase().includes(term));
      return matchesQuery && (activeCategory === "all" || getCategoryKey(place.category) === activeCategory);
    });
  }, [activeCategory, destinations, query]);

  const openDestination = (place) => navigate("/trip", { state: { districtId: place.districtId, placeId: place.placeId, budget: 0, days: 1 } });
  const isSaved = (placeId) => isAuthenticated && savedTrips.some((trip) => trip.placeId === placeId);
  const toggleSaved = async (place) => {
    if (!isAuthenticated) return navigate("/login", { state: { from: "/destinations" } });
    setSavingPlaceId(place.placeId);
    setSaveError("");
    try {
      const existing = savedTrips.find((trip) => trip.placeId === place.placeId);
      if (existing) { await api.delete(`/saved-trips/${existing._id}`); setSavedTrips((current) => current.filter((trip) => trip._id !== existing._id)); }
      else { const { data } = await api.post("/saved-trips", { ...place, imageUrl: place.imageUrl || "" }); setSavedTrips((current) => [data, ...current]); }
    } catch (requestError) { setSaveError(requestError.response?.data?.message || "We couldn't update your saved trips. Please try again."); }
    finally { setSavingPlaceId(""); }
  };

  return <SiteLayout><main className="bg-gradient-to-b from-sky-50 to-white pb-16"><section className="relative isolate overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-24"><img src="https://images.unsplash.com/photo-1523544545175-92e04b96d26b?auto=format&fit=crop&w=2000&q=85" alt="Mountain landscape in India" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-blue-950/45" /><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-200">India Tourism AI</p><h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">Explore Incredible India</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">Discover amazing tourist destinations powered by AI.</p></div></section><section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6"><div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Find your next escape</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Browse destinations</h2></div><label className="relative block w-full lg:max-w-md"><span className="sr-only">Search destinations</span><FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search place, district, state or category" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label></div><div className="mt-6 flex gap-2 overflow-x-auto pb-1">{categoryFilters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveCategory(filter.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === filter.id ? "bg-sky-700 text-white shadow-md shadow-sky-700/20" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"}`}>{filter.label}</button>)}</div></div>{loading && <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[430px] animate-pulse rounded-3xl bg-slate-100" />)}</div>}{error && <p className="mt-8 rounded-2xl bg-amber-50 p-5 text-amber-800">Destinations could not be loaded right now. Please try again shortly.</p>}{!loading && !error && <><div className="mt-8 flex items-center justify-between gap-4"><p className="text-sm font-semibold text-slate-500">{filtered.length} destination{filtered.length === 1 ? "" : "s"} found</p>{activeCategory !== "all" && <button type="button" onClick={() => setActiveCategory("all")} className="text-sm font-bold text-sky-700 hover:text-sky-900">Clear category</button>}</div><div className="mt-5 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((place) => <article key={place.placeId} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/60"><div className="h-52 overflow-hidden bg-slate-200"><DestinationImage place={place} /></div><div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><div><span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{place.category || "Destination"}</span><h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{place.placeName}</h2></div>{place.rating != null && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700"><FiStar className="fill-current" /> {place.rating}</span>}</div><p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500"><FiMapPin className="text-sky-700" /> {place.districtName}, {place.stateName}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{place.description || "Explore this destination and build a memorable travel plan."}</p><div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><FiCalendar className="text-sky-700" /><span>Best season: <strong className="font-semibold text-slate-700">{place.bestSeason || "Any time"}</strong></span></div><div className="mt-6 grid grid-cols-2 gap-2"><button type="button" onClick={() => toggleSaved(place)} disabled={savingPlaceId === place.placeId} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition disabled:opacity-60 ${isSaved(place.placeId) ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-700 hover:border-rose-200 hover:text-rose-700"}`}><FiHeart className={isSaved(place.placeId) ? "fill-current" : ""} /> {isSaved(place.placeId) ? "Saved" : "Save"}</button><button type="button" onClick={() => openDestination(place)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-3 py-3 text-sm font-bold text-white shadow-md shadow-sky-700/20 transition hover:bg-sky-800">Explore <FiArrowRight /></button></div></div></article>)}</div>{filtered.length === 0 && <p className="mt-8 rounded-2xl bg-white p-6 text-slate-600 shadow-sm">No destinations match those filters. Try another search or category.</p>}</>}</section></main></SiteLayout>;
}

export default Destinations;
