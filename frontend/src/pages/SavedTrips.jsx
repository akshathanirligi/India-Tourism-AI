import { useEffect, useState } from "react";
import { FiArrowRight, FiCalendar, FiHeart, FiMapPin, FiStar, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DestinationImage from "../components/DestinationImage";
import SiteLayout from "../components/SiteLayout";
import api from "../services/api";

function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = () => api.get("/saved-trips")
      .then(({ data }) => setTrips(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Saved trips could not be loaded."))
      .finally(() => setLoading(false));
    loadTrips();
    window.addEventListener("saved-trips-updated", loadTrips);
    return () => window.removeEventListener("saved-trips-updated", loadTrips);
  }, []);

  const remove = async (id) => {
    setRemoving(id);
    setError("");
    try {
      await api.delete(`/saved-trips/${id}`);
      setTrips((current) => current.filter((trip) => trip._id !== id));
      window.dispatchEvent(new CustomEvent("saved-trips-updated"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We couldn't remove this saved trip.");
    } finally {
      setRemoving("");
    }
  };

  const view = (trip) => navigate("/trip", { state: { districtId: trip.districtId, placeId: trip.placeId, budget: trip.budget ?? 0, days: trip.days ?? 1, savedTrip: trip } });

  return <SiteLayout><main className="min-h-[70vh] bg-gradient-to-b from-sky-50 to-white px-4 py-10 sm:px-6"><div className="mx-auto max-w-6xl"><section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-rose-600"><FiHeart className="fill-current" /> Travel wishlist</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Saved Trips</h1><p className="mt-2 text-slate-600">Your complete itineraries, ready whenever you are.</p></div><span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">{trips.length} saved</span></section>{error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}{loading ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl bg-slate-100" />)}</div> : trips.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{trips.map((trip) => <article key={trip._id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"><div className="h-48 overflow-hidden bg-slate-100"><DestinationImage place={trip} /></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-bold text-slate-900">{trip.placeName}</h2>{trip.rating != null && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700"><FiStar className="fill-current" /> {trip.rating}</span>}</div><p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600"><FiMapPin className="text-sky-700" /> {trip.districtName ? `${trip.districtName}, ` : ""}{trip.stateName || "India"}</p><div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600"><p className="inline-flex items-center gap-1.5"><FiCalendar className="text-sky-700" /> {new Date(trip.createdAt).toLocaleDateString()}</p><p className="text-right font-bold text-slate-800">Budget: ₹{trip.budget ?? 0}</p></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => view(trip)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-3 py-3 text-sm font-bold text-white hover:bg-sky-800">View Trip <FiArrowRight /></button><button type="button" onClick={() => remove(trip._id)} disabled={removing === trip._id} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"><FiTrash2 /> Remove</button></div></div></article>)}</div> : <section className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center"><FiHeart className="mx-auto text-3xl text-slate-300" /><h2 className="mt-4 text-xl font-bold text-slate-900">Your wishlist is waiting</h2><p className="mt-2 text-slate-600">Save a generated trip to find it here.</p><button type="button" onClick={() => navigate("/destinations")} className="mt-6 rounded-xl bg-sky-700 px-5 py-3 font-bold text-white hover:bg-sky-800">Explore Destinations</button></section>}</div></main></SiteLayout>;
}

export default SavedTrips;
