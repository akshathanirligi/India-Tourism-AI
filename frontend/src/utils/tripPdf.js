import { jsPDF } from "jspdf";
import api from "../services/api";

const weatherLabels = { 0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Foggy", 48: "Foggy", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers", 95: "Thunderstorm" };
const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
const destinationText = ({ placeName, district, state }) => [placeName, district, state, "India"].filter(Boolean).join(", ");

async function getLiveDetails(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return { weather: "Live weather is unavailable for this destination.", services: ["Nearby service information is unavailable."] };
  const weatherRequest = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=auto`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Weather unavailable"))).then((data) => `${weatherLabels[data.current.weather_code] || "Current conditions"}: ${Math.round(data.current.temperature_2m)}°C, humidity ${data.current.relative_humidity_2m}%, wind ${Math.round(data.current.wind_speed_10m)} km/h.`).catch(() => "Live weather is temporarily unavailable. Check local conditions before travel.");
  const servicesRequest = Promise.all(["hospital", "pharmacy", "fuel"].map((type) => api.get("/nearby", { params: { lat: latitude, lng: longitude, type } }).then(({ data }) => data.results?.[0]).catch(() => null))).then((results) => results.filter(Boolean).map((result) => `${result.name} — ${result.distanceKm} km away`)).then((results) => results.length ? results : ["Nearby service information is temporarily unavailable."]);
  const [weather, services] = await Promise.all([weatherRequest, servicesRequest]);
  return { weather, services };
}

export async function downloadTripPdf({ place, district, state, budget, days, summary }) {
  const latitude = Number(place?.latitude); const longitude = Number(place?.longitude);
  const { weather, services } = await getLiveDetails(latitude, longitude);
  const destination = destinationText({ placeName: place?.placeName, district, state });
  const mapLink = Number.isFinite(latitude) && Number.isFinite(longitude) ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  const bookingLinks = [["Flights", `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights to ${destination}`)}`], ["Trains", "https://www.irctc.co.in/nget/train-search"], ["Buses", "https://www.redbus.in/"], ["Hotels", `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`], ["Cabs", "https://www.uber.com/in/en/ride/"]];
  const doc = new jsPDF({ unit: "mm", format: "a4" }); const pageWidth = doc.internal.pageSize.getWidth(); const margin = 16; let y = 18;
  const newPage = () => { doc.addPage(); y = 18; };
  const section = (title) => { if (y > 260) newPage(); doc.setFillColor(14, 116, 144); doc.roundedRect(margin, y, pageWidth - margin * 2, 9, 2, 2, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(title, margin + 4, y + 6); y += 14; doc.setTextColor(30, 41, 59); };
  const paragraph = (text) => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); const lines = doc.splitTextToSize(String(text), pageWidth - margin * 2); if (y + lines.length * 5 > 278) newPage(); doc.text(lines, margin, y); y += lines.length * 5 + 4; };
  const bullets = (items) => items.forEach((item) => paragraph(`• ${item}`));
  doc.setFillColor(3, 105, 161); doc.rect(0, 0, pageWidth, 40, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.text("India Tourism AI", margin, 18); doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.text("Personal Trip Plan", margin, 27); doc.setFontSize(9); doc.text(`Generated ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date())}`, margin, 34);
  y = 52; doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text(place?.placeName || "Your Destination", margin, y); y += 8; doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(71, 85, 105); doc.text([district, state].filter(Boolean).join(", ") || "India", margin, y); y += 9;
  section("Destination overview"); paragraph(place?.description || "Discover this memorable destination and make the most of your journey."); section("Live weather"); paragraph(weather); section("Budget summary"); bullets([`Your budget: ${money(budget)}`, `Trip duration: ${days} day${Number(days) === 1 ? "" : "s"}`, `Estimated minimum cost: ${money((summary?.entryFee || 0) + (summary?.foodCost || 0) + (summary?.stayCost || 0))}`, `Stay: ${money(summary?.stayCost)}  |  Food: ${money(summary?.foodCost)}  |  Entry: ${money(summary?.entryFee)}`, summary?.message || "Review your budget before booking."]); section("Nearby essential services"); bullets(services); section("Map and navigation"); paragraph(`Open directions: ${mapLink}`); section("Travel booking links"); bullets(bookingLinks.map(([name, url]) => `${name}: ${url}`)); section("Travel tips"); bullets([`Best season: ${place?.bestSeason || "Check local seasonal conditions before travel."}`, "Carry a government-issued ID and keep offline copies of reservations.", "Start outdoor sightseeing early and allow extra time for local travel.", "Check local weather, opening hours, entry rules, and safety guidance on the day of your visit."]);
  doc.setTextColor(100, 116, 139); doc.setFontSize(8); doc.text("India Tourism AI • Plan smarter, travel better", margin, 287); doc.save(`${(place?.placeName || "trip-plan").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}-trip-plan.pdf`);
}
