import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock, FiCompass, FiDownload, FiMapPin, FiNavigation, FiStar, FiTag } from "react-icons/fi";
import Accordion from "./components/Accordion";
import DestinationImage from "./components/DestinationImage";
import NearbyServices from "./components/NearbyServices";
import SectionErrorBoundary from "./components/SectionErrorBoundary";
import UserLocationMap from "./components/UserLocationMap";
import WeatherCard from "./components/WeatherCard";
import TravelBookingHub from "./components/TravelBookingHub";
import TravelTimeline from "./components/TravelTimeline";
import SiteLayout from "./components/SiteLayout";
import About from "./pages/About";
import Destinations from "./pages/Destinations";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SavedTrips from "./pages/SavedTrips";
import TripHistory from "./pages/TripHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";

function TripResult() {
  const { state } = useLocation();
  const [trip, setTrip] = useState(() => state?.savedTrip?.tripData || null);
  const [openAccordion, setOpenAccordion] = useState("weather");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [savedTrip, setSavedTrip] = useState(() => state?.savedTrip || null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [toast, setToast] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!state) return;
    if (state.savedTrip?.tripData) return;

    api.post("/trip", state)
      .then(({ data }) => setTrip(data))
      .catch(() => setTrip({ touristPlaces: [], hotels: [], restaurants: [], estimatedBudget: 0 }));
  }, [state]);

  useEffect(() => {
    if (!isAuthenticated || !state?.placeId || state.savedTrip) return;
    api.get("/saved-trips").then(({ data }) => setSavedTrip(Array.isArray(data) ? data.find((item) => item.placeId === state.placeId) || null : null)).catch(() => setSavedTrip(null));
  }, [isAuthenticated, state]);

  if (!state) return <main className="grid min-h-screen place-items-center"><Link className="font-semibold text-blue-600" to="/">Plan a trip first</Link></main>;
  if (!trip) return <main className="grid min-h-screen place-items-center text-xl">Creating your trip plan...</main>;

  const touristPlaces = Array.isArray(trip.touristPlaces) ? trip.touristPlaces : [];
  const place = touristPlaces.find((item) => item.placeId === state.placeId) || touristPlaces[0];
  const latitude = Number(place?.latitude);
  const longitude = Number(place?.longitude);
  const hasPlaceCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const summary = trip.budgetSummary;
  const locationParts = typeof place?.location === "string" ? place.location.split(",").map((part) => part.trim()).filter(Boolean) : [];
  const district = place?.districtName || (locationParts.length > 1 ? locationParts.at(-2) : null) || place?.districtId || "Not listed";
  const placeState = place?.stateName || (locationParts.length > 2 ? locationParts.at(-1) : null) || "Not listed";

  const placeFacts = [
    { label: "Rating", value: place?.rating ?? "—", icon: FiStar, color: "text-amber-300" },
    { label: "Best season", value: place?.bestSeason || "Any time", icon: FiCalendar },
    { label: "Entry fee", value: place?.entryFee === 0 ? "Free" : place?.entryFee != null ? `₹${place.entryFee}` : "—", icon: FiTag },
    { label: "Visit time", value: place?.averageVisitTime || "Flexible", icon: FiClock },
    { label: "District", value: district, icon: FiMapPin },
    { label: "State", value: placeState, icon: FiCompass },
  ];
  const downloadPdf = async () => { if (!place || downloadingPdf) return; setDownloadingPdf(true); try { const { downloadTripPdf } = await import("./utils/tripPdf"); await downloadTripPdf({ place, district, state: placeState, budget: state.budget, days: state.days, summary }); } finally { setDownloadingPdf(false); } };
  const getWeatherSnapshot = async () => {
    if (!hasPlaceCoordinates) return null;
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset,precipitation_probability_max&forecast_days=1&timezone=auto`);
      const data = response.ok ? await response.json() : null;
      return data?.current && data?.daily ? data : null;
    } catch { return null; }
  };
  const toggleSaveTrip = async () => {
    if (!isAuthenticated) { window.location.assign("/login"); return; }
    if (!place || savingTrip) return;
    setSavingTrip(true);
    try {
      if (savedTrip?.tripData) {
        await api.delete(`/saved-trips/${savedTrip._id}`);
        setSavedTrip(null);
      } else {
        const { data } = await api.post("/saved-trips", { placeId: place.placeId, placeName: place.placeName, districtId: place.districtId || state.districtId, districtName: district, stateName: placeState, category: place.category, rating: place.rating, imageUrl: place.imageUrl || "", description: place.description || "", days: state.days, budget: state.budget, weatherSnapshot: await getWeatherSnapshot(), tripData: trip });
        setSavedTrip(data);
        setToast("Trip Saved Successfully");
        window.setTimeout(() => setToast(""), 3500);
      }
      window.dispatchEvent(new CustomEvent("saved-trips-updated"));
    } catch (error) {
      setToast(error.response?.data?.message || "Unable to update saved trips.");
      window.setTimeout(() => setToast(""), 3500);
    } finally { setSavingTrip(false); }
  };

  return (
    <SiteLayout><main className="bg-gradient-to-b from-sky-50 via-slate-50 to-white px-4 py-6 text-slate-800 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-2 py-2 font-semibold text-sky-700 transition hover:bg-white hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"><FiArrowLeft /> Plan another trip</Link>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Your itinerary</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your {state.days}-Day Trip Plan</h1></div>
          <div className="flex flex-wrap items-center gap-2"><p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-100">Budget: <span className="font-bold text-slate-900">₹{state.budget}</span></p><button type="button" onClick={downloadPdf} disabled={!place || downloadingPdf} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60"><FiDownload /> {downloadingPdf ? "Preparing PDF..." : "Download Trip PDF"}</button><button type="button" onClick={toggleSaveTrip} disabled={!place || savingTrip} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${savedTrip?.tripData ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-rose-600 text-white hover:bg-rose-700"}`}><span aria-hidden="true">❤️</span> {savingTrip ? "Saving..." : savedTrip?.tripData ? "Saved" : "Save Trip"}</button></div>
        </div>

        {place && <section className="mt-8 overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl shadow-slate-200/70"><div className="grid lg:grid-cols-[1.25fr_0.75fr]"><div className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800 p-6 text-white sm:p-9"><div className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-sky-300/20 blur-2xl" /><div className="relative"><div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-sky-100"><span className="inline-flex items-center gap-1.5"><FiMapPin /> {district}, {placeState}</span><span className="rounded-full bg-white/15 px-3 py-1">{place.category || "Destination"}</span></div><h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{place.placeName}</h2><p className="mt-4 max-w-2xl leading-7 text-sky-50/90">{place.description || "Discover this memorable destination on your trip."}</p><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">{placeFacts.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm"><Icon className={color || "text-sky-200"} /><p className="mt-2 text-xs text-sky-100">{label}</p><p className="text-sm font-bold">{value}</p></div>)}</div></div></div><div className="h-64 lg:h-full"><DestinationImage place={{ ...place, districtName: district, stateName: placeState }} /></div></div></section>}

        {place && hasPlaceCoordinates && <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Plan your route</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Tourist map</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800"><FiMapPin /> {place.location || "Destination location"}</span></div><SectionErrorBoundary fallback={<p className="rounded-xl bg-slate-100 p-4 text-slate-600">Map could not load. Use the navigation button below.</p>}><UserLocationMap destinationLat={latitude} destinationLng={longitude} placeName={place.placeName} /></SectionErrorBoundary><div className="mt-4 flex justify-center"><a href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"><FiNavigation /> Navigate with Google Maps</a></div></section>}

        {place && <TravelTimeline days={state.days} place={place} nearbyPlaces={touristPlaces} />}

        <div className="mt-6 space-y-4 sm:mt-8">
          {hasPlaceCoordinates && <Accordion id="weather" title={savedTrip?.weatherSnapshot ? "Saved Weather Snapshot" : "Live Weather"} icon="🌤" openId={openAccordion} onToggle={setOpenAccordion}><WeatherCard latitude={latitude} longitude={longitude} snapshot={savedTrip?.weatherSnapshot} /></Accordion>}
          {hasPlaceCoordinates && <Accordion id="nearby" title="Nearby Services" icon="📍" openId={openAccordion} onToggle={setOpenAccordion}><NearbyServices latitude={latitude} longitude={longitude} /></Accordion>}
          <Accordion id="budget" title="Budget Summary" icon="💰" openId={openAccordion} onToggle={setOpenAccordion}>{summary && <div className={`rounded-2xl border p-5 ${summary.withinBudget ? "border-emerald-100 bg-emerald-50 text-emerald-900" : "border-amber-100 bg-amber-50 text-amber-900"}`}><h2 className="font-bold">{summary.withinBudget ? "✓ This trip is within your budget" : "⚠ Budget needs adjustment"}</h2><p className="mt-2">{summary.message}</p>{!summary.withinBudget && <p className="mt-2 text-sm">Try fewer days, a lower-cost stay, or make this a day trip.</p>}</div>}<div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 p-5 text-white shadow-lg shadow-sky-600/20"><p className="text-sm">Cheapest available plan</p><p className="text-3xl font-bold">₹{trip.estimatedBudget}</p>{summary && <p className="mt-2 text-sm">Stay ₹{summary.stayCost} · Food ₹{summary.foodCost} · Entry ₹{summary.entryFee}</p>}</div></Accordion>
          <TravelBookingHub placeName={place?.placeName} district={district !== "Not listed" ? district : ""} state={placeState !== "Not listed" ? placeState : ""} />
        </div>
      </div>
    </main>{toast && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-xl">{toast}</div>}</SiteLayout>
  );
}

export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Home />} /><Route path="/destinations" element={<Destinations />} /><Route path="/planner" element={<Planner />} /><Route path="/about" element={<About />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /><Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} /><Route path="/trip-history" element={<ProtectedRoute><TripHistory /></ProtectedRoute>} /><Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /><Route path="/trip" element={<TripResult />} /></Routes></BrowserRouter>;
}
