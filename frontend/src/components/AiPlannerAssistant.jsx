import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck, FiChevronDown, FiClock, FiCompass, FiDollarSign, FiMapPin, FiZap } from "react-icons/fi";
import api from "../services/api";

const travelStyles = [
  ["🏔", "Adventure"], ["🏖", "Relaxation"], ["🛕", "Spiritual"], ["👨‍👩‍👧", "Family"], ["💕", "Couple"],
  ["🎒", "Solo"], ["🍴", "Food"], ["📸", "Photography"], ["🌿", "Nature"],
];
const preferenceOptions = ["Avoid Crowds", "Budget Friendly", "Luxury Stay", "Local Food", "Shopping", "Sunrise/Sunset Spots", "Historical Places", "Trekking", "Kid Friendly"];
const savedPreferencesKey = "india-tourism-ai-planner-preferences";
function readSavedPlannerSettings() { try { const saved = JSON.parse(localStorage.getItem(savedPreferencesKey)); return { travelStyle: saved?.travelStyle || "", preferences: Array.isArray(saved?.preferences) ? saved.preferences : [] }; } catch { return { travelStyle: "", preferences: [] }; } }

function Field({ icon: Icon, label, hint, children }) {
  return <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100/70 sm:p-6">
    <div className="mb-4 flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700"><Icon /></span><div><h3 className="font-bold text-slate-900">{label}</h3>{hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}</div></div>
    {children}
  </section>;
}

function SelectField({ value, onChange, disabled, children }) {
  return <div className="relative"><select value={value} onChange={onChange} disabled={disabled} className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60">{children}</select><FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" /></div>;
}

function AiPlannerAssistant() {
  const [states, setStates] = useState([]); const [districts, setDistricts] = useState([]); const [places, setPlaces] = useState([]);
  const [stateId, setStateId] = useState(""); const [districtId, setDistrictId] = useState(""); const [placeId, setPlaceId] = useState("");
  const [budget, setBudget] = useState(""); const [days, setDays] = useState(""); const [loading, setLoading] = useState(""); const [isGenerating, setIsGenerating] = useState(false); const [showSuccess, setShowSuccess] = useState(false);
  const [savedSettings] = useState(readSavedPlannerSettings); const [travelStyle, setTravelStyle] = useState(savedSettings.travelStyle); const [preferences, setPreferences] = useState(savedSettings.preferences);
  const navigate = useNavigate();

  useEffect(() => { api.get("/states").then(({ data }) => setStates(Array.isArray(data) ? data : [])).catch(() => setStates([])); }, []);
  useEffect(() => { try { localStorage.setItem(savedPreferencesKey, JSON.stringify({ travelStyle, preferences })); } catch { /* planner remains usable when storage is unavailable */ } }, [travelStyle, preferences]);

  const selectState = async (value) => { setStateId(value); setDistrictId(""); setPlaceId(""); setPlaces([]); setDistricts([]); if (!value) return; try { setLoading("districts"); const { data } = await api.get(`/districts/${value}`); setDistricts(Array.isArray(data) ? data : []); } catch { setDistricts([]); } finally { setLoading(""); } };
  const selectDistrict = async (value) => { setDistrictId(value); setPlaceId(""); setPlaces([]); if (!value) return; try { setLoading("places"); const { data } = await api.get(`/tourist-places/${value}`); setPlaces(Array.isArray(data) ? data : []); } catch { setPlaces([]); } finally { setLoading(""); } };
  const canGenerate = stateId && districtId && placeId && Number(budget) > 0 && Number(days) > 0;
  const progress = useMemo(() => [Boolean(placeId), Boolean(budget && days), Boolean(travelStyle || preferences.length)], [placeId, budget, days, travelStyle, preferences]);
  const togglePreference = (preference) => setPreferences((current) => current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]);
  const generate = () => { if (!canGenerate) return; setIsGenerating(true); setShowSuccess(false); const stateName = states.find((state) => state.stateId === stateId)?.stateName || ""; window.setTimeout(() => { setShowSuccess(true); window.setTimeout(() => navigate("/trip", { state: { districtId, placeId, budget: Number(budget), days: Number(days), stateName, interests: preferences, saveToHistory: true } }), 700); }, 650); };

  return <div className="mx-auto max-w-5xl">
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur sm:grid-cols-4">
      {["Destination", "Budget", "Preferences", "Generate Plan"].map((step, index) => <div key={step} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${index < 3 && progress[index] ? "bg-emerald-50 text-emerald-700" : index === 3 ? "bg-sky-600 text-white" : "text-slate-500"}`}><span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${index < 3 && progress[index] ? "bg-emerald-600 text-white" : index === 3 ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{index < 3 && progress[index] ? <FiCheck /> : index + 1}</span>{step}</div>)}
    </div>

    <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-5">
        <Field icon={FiMapPin} label="Step 1 · Where do you want to travel?" hint="Start with a state, then narrow down your perfect destination."><div className="grid gap-3 sm:grid-cols-3"><SelectField value={stateId} onChange={(event) => selectState(event.target.value)}><option value="">Select state</option>{states.map((state) => <option key={state.stateId} value={state.stateId}>{state.stateName}</option>)}</SelectField><SelectField value={districtId} onChange={(event) => selectDistrict(event.target.value)} disabled={!stateId || loading === "districts"}><option value="">{loading === "districts" ? "Finding districts..." : "Select district"}</option>{districts.map((district) => <option key={district.districtId} value={district.districtId}>{district.districtName}</option>)}</SelectField><SelectField value={placeId} onChange={(event) => setPlaceId(event.target.value)} disabled={!districtId || loading === "places"}><option value="">{loading === "places" ? "Finding places..." : "Select place"}</option>{places.map((place) => <option key={place.placeId} value={place.placeId}>{place.placeName}</option>)}</SelectField></div>{districtId && !loading && places.length === 0 && <p className="mt-3 text-sm text-amber-700">Places for this district are coming soon. Try Karnataka → Kodagu for a complete trip.</p>}</Field>
        <div className="grid gap-5 sm:grid-cols-2"><Field icon={FiClock} label="Step 2 · How many days?" hint="Give your itinerary room to breathe."><input type="number" min="1" inputMode="numeric" value={days} onChange={(event) => setDays(event.target.value)} placeholder="e.g. 3" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" /></Field><Field icon={FiDollarSign} label="Step 3 · What's your budget?" hint="Your total trip budget in rupees."><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span><input type="number" min="1" inputMode="numeric" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="10,000" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-8 pr-4 font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100" /></div></Field></div>
      </div>
      <aside className="rounded-3xl bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800 p-6 text-white shadow-xl shadow-sky-900/15"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl"><FiZap /></div><p className="mt-6 text-sm font-bold uppercase tracking-[.16em] text-sky-200">Your AI companion</p><h2 className="mt-2 text-2xl font-bold tracking-tight">A trip plan tailored to your pace.</h2><p className="mt-3 leading-7 text-sky-100">Choose the essentials, add your travel personality, and we’ll create the same practical itinerary you already rely on.</p><div className="mt-7 space-y-3 border-t border-white/15 pt-5 text-sm text-sky-100"><p className="flex gap-2"><FiCheck className="mt-0.5 shrink-0" /> Destination-aware suggestions</p><p className="flex gap-2"><FiCheck className="mt-0.5 shrink-0" /> Budget and duration planning</p><p className="flex gap-2"><FiCheck className="mt-0.5 shrink-0" /> Preferences saved for future AI features</p></div></aside>
    </div>

    <Field icon={FiCompass} label="Step 4 · Choose Your Travel Style" hint="Pick the vibe that best describes this journey."><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{travelStyles.map(([emoji, name]) => <button type="button" key={name} onClick={() => setTravelStyle(name)} className={`rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${travelStyle === name ? "border-sky-500 bg-sky-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-sky-300"}`}><span className="text-2xl">{emoji}</span><span className="mt-2 block text-sm font-bold text-slate-800">{name}</span></button>)}</div></Field>
    <div className="mt-5"><Field icon={FiZap} label="Travel Preferences" hint="Optional selections saved locally for future AI integration."><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{preferenceOptions.map((preference) => <label key={preference} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition ${preferences.includes(preference) ? "border-sky-300 bg-sky-50 text-sky-800" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200"}`}><input type="checkbox" checked={preferences.includes(preference)} onChange={() => togglePreference(preference)} className="h-4 w-4 rounded border-slate-300 accent-sky-600" />{preference}</label>)}</div></Field></div>
    <div className="mt-6 text-center"><button type="button" onClick={generate} disabled={!canGenerate || isGenerating} className="inline-flex min-w-64 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-600/25 transition duration-200 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200">{isGenerating ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" /> Creating your plan…</> : <>Generate Trip <FiArrowRight /></>}</button><p className="mt-3 text-sm text-slate-500">Complete your destination, duration, and budget to generate.</p></div>
    <AnimatePresence>{showSuccess && <motion.div initial={{ opacity: 0, y: 12, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-xl"><FiCheck /> Your AI trip plan is ready!</motion.div>}</AnimatePresence>
  </div>;
}

export default AiPlannerAssistant;
