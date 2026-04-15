import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import api from "../services/api";

function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [removing, setRemoving] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/trip-history").then(({ data }) => setTrips(Array.isArray(data) ? data : [])).catch((requestError) => setError(requestError.response?.data?.message || "Trip history could not be loaded.")).finally(() => setLoading(false));
  }, []);

  const states = useMemo(() => [...new Set(trips.map((trip) => trip.stateName).filter(Boolean))].sort(), [trips]);
  const visibleTrips = useMemo(() => {
    const term = query.trim().toLowerCase();
    return trips.filter((trip) => (!stateFilter || trip.stateName === stateFilter) && (!term || [trip.destination, trip.stateName].some((value) => value?.toLowerCase().includes(term))));
  }, [query, stateFilter, trips]);

  const deleteTrip = async (id) => {
    setRemoving(id);
    setError("");
    try {
      await api.delete(`/trip-history/${id}`);
      setTrips((current) => current.filter((trip) => trip._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't delete this trip.");
    } finally {
      setRemoving("");
    }
  };

  const viewAgain = (trip) => navigate("/trip", { state: { districtId: trip.districtId, placeId: trip.placeId, budget: trip.budget, days: trip.days, interests: trip.interests, stateName: trip.stateName } });
  const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

  return <SiteLayout><main className="min-h-[70vh] bg-gradient-to-b from-sky-50 to-white px-4 py-10 sm:px-6"><div className="mx-auto max-w-6xl"><section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-sky-700"><FiClock /> Your travel timeline</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Trip History</h1><p className="mt-2 text-slate-600">Revisit plans you have already created.</p></div><span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">{trips.length} plans</span></section><section className="mt-8 grid gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]"><label className="relative"><span className="sr-only">Search trip history</span><FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destination or state" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"><option value="">All states</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select></section>{error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}{loading ? <div className="mt-6 grid gap-5 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-52 animate-pulse rounded-3xl bg-slate-100" />)}</div> : visibleTrips.length ? <div className="mt-6 grid gap-5 md:grid-cols-2">{visibleTrips.map((trip) => <article key={trip._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/50"><div className="flex items-start justify-between gap-4"><div><p className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700"><FiMapPin /> {trip.stateName || "India"}</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{trip.destination}</h2></div><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">{trip.days} day{trip.days === 1 ? "" : "s"}</span></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-slate-600"><FiCalendar className="text-sky-700" /> {formatDate(trip.createdAt)}</p><p className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 font-bold text-slate-700"><FiDollarSign className="text-sky-700" /> ₹{Number(trip.budget).toLocaleString("en-IN")}</p></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => viewAgain(trip)} className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800">View Again</button><button type="button" onClick={() => deleteTrip(trip._id)} disabled={removing === trip._id} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"><FiTrash2 /> Delete</button></div></article>)}</div> : <section className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center"><FiClock className="mx-auto text-3xl text-slate-300" /><h2 className="mt-4 text-xl font-bold text-slate-900">No matching trip plans</h2><p className="mt-2 text-slate-600">Generate a trip plan to begin building your travel history.</p></section>}</div></main></SiteLayout>;
}

export default TripHistory;
