import { useEffect, useState } from "react";

function WeatherCard({ latitude, longitude, snapshot = null }) {
  const [weather, setWeather] = useState(snapshot);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (snapshot) return undefined;
    const controller = new AbortController();
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset,precipitation_probability_max&forecast_days=1&timezone=auto`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Weather service is unavailable");
        return response.json();
      })
      .then((data) => {
        if (!data?.current || !data?.daily) throw new Error("Weather data is incomplete");
        setWeather(data);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(true);
      });

    return () => controller.abort();
  }, [latitude, longitude, snapshot]);

  const weatherData = snapshot || weather;
  if (error && !weatherData) return <div className="rounded-2xl bg-slate-100 p-5 text-slate-600">Weather is unavailable right now.</div>;
  if (!weatherData) return <div className="rounded-2xl bg-slate-100 p-5 text-slate-600">Loading weather...</div>;

  const { current, daily } = weatherData;
  const sunrise = daily.sunrise?.[0]?.split("T")[1] || "—";
  const sunset = daily.sunset?.[0]?.split("T")[1] || "—";
  const facts = [
    ["Temperature", `${current.temperature_2m ?? "—"}°C`],
    ["Humidity", `${current.relative_humidity_2m ?? "—"}%`],
    ["Wind", `${current.wind_speed_10m ?? "—"} km/h`],
    ["Rain chance", `${daily.precipitation_probability_max?.[0] ?? "—"}%`],
    ["Sunrise", sunrise],
    ["Sunset", sunset],
  ];

  return <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{facts.map(([label, value]) => <div key={label} className="rounded-xl bg-sky-50/70 px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-800">{value}</p></div>)}</div></section>;
}

export default WeatherCard;
