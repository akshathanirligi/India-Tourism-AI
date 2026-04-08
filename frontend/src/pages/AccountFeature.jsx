import { FiClock, FiHeart, FiLayout, FiLock } from "react-icons/fi";
import SiteLayout from "../components/SiteLayout";

const details = {
  "/saved-trips": { title: "Saved Trips", icon: FiHeart, description: "Your saved travel ideas will be collected here." },
  "/trip-history": { title: "Trip History", icon: FiClock, description: "Trips you create will appear here in the future." },
  "/dashboard": { title: "Travel Dashboard", icon: FiLayout, description: "A private overview of your travel activity will appear here." },
};

function AccountFeature({ path }) { const feature = details[path]; const Icon = feature.icon; return <SiteLayout><main className="min-h-[70vh] bg-gradient-to-b from-sky-50 to-white px-4 py-10"><section className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/60"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Icon className="text-xl" /></span><p className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.16em] text-sky-700"><FiLock /> Private area</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{feature.title}</h1><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></section></main></SiteLayout>; }
export default AccountFeature;
