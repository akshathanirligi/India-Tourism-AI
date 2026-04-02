import { FiArrowUpRight } from "react-icons/fi";
import { FaBusSimple, FaHotel, FaPlaneDeparture, FaTaxi, FaTrainSubway } from "react-icons/fa6";

const buildDestination = ({ placeName, district, state }) => [placeName, district, state, "India"].filter(Boolean).join(", ");

function TravelBookingCard({ booking }) {
  const Icon = booking.icon;
  return <a href={booking.href} target="_blank" rel="noopener noreferrer" className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"><div className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${booking.accent} opacity-15 transition duration-300 group-hover:scale-150`} /><div className={`relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${booking.accent} text-2xl text-white shadow-lg ${booking.shadow}`}><Icon /></div><div className="relative mt-5 flex flex-1 flex-col"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-bold text-slate-900">{booking.title}</h3><FiArrowUpRight className="mt-0.5 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-700" /></div><p className="mt-2 text-sm leading-6 text-slate-600">{booking.description}</p><span className="mt-5 text-sm font-bold text-sky-700">Book now</span></div></a>;
}

function TravelBookingHub({ placeName, district, state }) {
  const destination = buildDestination({ placeName, district, state });
  const bookings = [
    { title: "Flights", description: `Find flights to ${district || placeName || "your destination"} with Google Flights.`, href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights to ${destination}`)}`, icon: FaPlaneDeparture, accent: "from-sky-500 to-blue-700", shadow: "shadow-sky-600/25" },
    { title: "Trains", description: "Check train routes, availability, and reservations on IRCTC.", href: "https://www.irctc.co.in/nget/train-search", icon: FaTrainSubway, accent: "from-indigo-500 to-violet-700", shadow: "shadow-indigo-600/25" },
    { title: "Buses", description: "Explore bus operators and schedules on RedBus.", href: "https://www.redbus.in/", icon: FaBusSimple, accent: "from-rose-500 to-red-700", shadow: "shadow-rose-600/25" },
    { title: "Hotels", description: `Browse stays near ${placeName || district || "your destination"} on Booking.com.`, href: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`, icon: FaHotel, accent: "from-emerald-500 to-teal-700", shadow: "shadow-emerald-600/25" },
    { title: "Cabs", description: "Book a local cab or arrange your airport transfer with Uber.", href: "https://www.uber.com/in/en/ride/", icon: FaTaxi, accent: "from-amber-400 to-orange-600", shadow: "shadow-amber-600/25" },
  ];
  return <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7" aria-labelledby="travel-booking-hub-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Finish planning</p><h2 id="travel-booking-hub-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-900">🚀 Travel Booking Hub</h2><p className="mt-2 text-slate-600">Complete your journey by booking your travel and stay.</p></div><span className="inline-flex w-fit items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800">Destination: {district || placeName || "Selected trip"}</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{bookings.map((booking) => <TravelBookingCard key={booking.title} booking={booking} />)}</div></section>;
}

export default TravelBookingHub;
