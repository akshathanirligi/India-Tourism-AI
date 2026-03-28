import { FiCompass, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

function Footer() {
  return <footer className="border-t border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-2 font-semibold text-slate-700"><FiCompass className="text-sky-700" /> India Tourism AI</div><div className="flex flex-wrap gap-x-5 gap-y-2"><Link to="/destinations" className="hover:text-sky-700">Destinations</Link><Link to="/planner" className="hover:text-sky-700">Plan a trip</Link><Link to="/about" className="hover:text-sky-700">About</Link></div><p className="inline-flex items-center gap-1">Made for better journeys <FiHeart className="text-rose-500" /></p></div></footer>;
}

export default Footer;
