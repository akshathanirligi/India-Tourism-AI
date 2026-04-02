import { useState } from "react";
import { FiActivity, FiCoffee, FiCreditCard, FiDroplet, FiHome, FiMapPin, FiShield, FiTruck } from "react-icons/fi";
import NearbyPlaces from "./NearbyPlaces";

const services = [
  { id: "hospital", label: "Hospitals", icon: <FiActivity /> },
  { id: "bank", label: "Banks", icon: <FiHome /> },
  { id: "atm", label: "ATMs", icon: <FiCreditCard /> },
  { id: "fuel", label: "Petrol Pumps", icon: <FiDroplet /> },
  { id: "police", label: "Police", icon: <FiShield /> },
  { id: "pharmacy", label: "Pharmacy", icon: <FiActivity /> },
  { id: "hotel", label: "Hotels", icon: <FiHome /> },
  { id: "restaurant", label: "Restaurants", icon: <FiCoffee /> },
  { id: "bus_stop", label: "Bus", icon: <FiTruck /> },
  { id: "railway_station", label: "Railway", icon: <FiMapPin /> },
  { id: "toilets", label: "Toilets", icon: <FiMapPin /> },
];

function NearbyServices({ latitude, longitude }) {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">Free OpenStreetMap data, ordered by straight-line distance. The search expands automatically until services are found whenever possible.</p>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {services.map((service) => (
          <button key={service.id} type="button" onClick={() => setActiveService(service)} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${activeService.id === service.id ? "bg-sky-700 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"}`}>
            {service.icon} {service.label}
          </button>
        ))}
      </div>
      <NearbyPlaces key={activeService.id} latitude={latitude} longitude={longitude} type={activeService.id} label={activeService.label} />
    </div>
  );
}

export default NearbyServices;
