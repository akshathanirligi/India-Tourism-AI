import { useEffect, useState } from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import api from "../services/api";

function NearbyPlaces({ latitude, longitude, type, label }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    api.get("/nearby", {
      params: { lat: latitude, lng: longitude, type },
      signal: controller.signal,
    })
      .then(({ data }) => {
        if (!controller.signal.aborted) setPlaces(Array.isArray(data?.results) ? data.results : []);
      })
      .catch((requestError) => {
        if (requestError.name !== "CanceledError") {
          const backendError = requestError.response?.data?.message || requestError.message;
          setError(`Nearby services error: ${backendError}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [latitude, longitude, type]);

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>;
  }

  if (error) return <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{error}</p>;
  if (!places.length) return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No {label.toLowerCase()} could be found in the wider surrounding area.</p>;

  return (
    <div className="space-y-3">
      {places.map((place) => (
        <article key={place.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
          <div>
            <h3 className="font-semibold text-slate-800">{place.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><FiMapPin /> {place.address}</p>
            <p className="mt-2 text-sm font-medium text-sky-700">{place.distanceKm} km away</p>
            <p className="mt-1 text-xs text-slate-400">{place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}</p>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-sky-700 hover:bg-sky-100" aria-label={`Navigate to ${place.name}`}><FiNavigation /></a>
        </article>
      ))}
    </div>
  );
}

export default NearbyPlaces;
