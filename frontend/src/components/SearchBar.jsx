import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SearchBar() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/states").then(({ data }) => setStates(Array.isArray(data) ? data : [])).catch(() => setStates([]));
  }, []);

  const selectState = async (value) => {
    setStateId(value); setDistrictId(""); setPlaceId(""); setPlaces([]); setDistricts([]);
    if (!value) return;
    try { setLoading("districts"); const { data } = await api.get(`/districts/${value}`); setDistricts(Array.isArray(data) ? data : []); }
    catch { setDistricts([]); } finally { setLoading(""); }
  };

  const selectDistrict = async (value) => {
    setDistrictId(value); setPlaceId(""); setPlaces([]);
    if (!value) return;
    try { setLoading("places"); const { data } = await api.get(`/tourist-places/${value}`); setPlaces(Array.isArray(data) ? data : []); }
    catch { setPlaces([]); } finally { setLoading(""); }
  };

  const explore = () => navigate("/trip", { state: { districtId, placeId, budget: Number(budget), days: Number(days), stateName: states.find((state) => state.stateId === stateId)?.stateName || "" } });
  const canExplore = stateId && districtId && placeId && budget > 0 && days > 0;

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Plan Your Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div><label className="block text-gray-700 font-semibold mb-2">State</label><select className="w-full border rounded-lg p-3 text-gray-700" value={stateId} onChange={(e) => selectState(e.target.value)}><option value="">Select State</option>{states.map((state) => <option key={state.stateId} value={state.stateId}>{state.stateName}</option>)}</select></div>
        <div><label className="block text-gray-700 font-semibold mb-2">District</label><select className="w-full border rounded-lg p-3 text-gray-700 disabled:bg-gray-100" disabled={!stateId || loading === "districts"} value={districtId} onChange={(e) => selectDistrict(e.target.value)}><option value="">{loading === "districts" ? "Loading..." : "Select District"}</option>{districts.map((district) => <option key={district.districtId} value={district.districtId}>{district.districtName}</option>)}</select></div>
        <div><label className="block text-gray-700 font-semibold mb-2">Tourist Place</label><select className="w-full border rounded-lg p-3 text-gray-700 disabled:bg-gray-100" disabled={!districtId || loading === "places"} value={placeId} onChange={(e) => setPlaceId(e.target.value)}><option value="">{loading === "places" ? "Loading..." : "Select Place"}</option>{places.map((place) => <option key={place.placeId} value={place.placeId}>{place.placeName}</option>)}</select></div>
        <div><label className="block text-gray-700 font-semibold mb-2">Budget</label><input type="number" min="1" placeholder="₹10000" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full border rounded-lg p-3 text-gray-700" /></div>
        <div><label className="block text-gray-700 font-semibold mb-2">Days</label><input type="number" min="1" placeholder="3" value={days} onChange={(e) => setDays(e.target.value)} className="w-full border rounded-lg p-3 text-gray-700" /></div>
      </div>
      {districtId && !loading && places.length === 0 && <p className="text-amber-600 text-sm mt-4 text-center">Tourist places for this district are coming soon. Try Karnataka → Kodagu to see the first complete trip.</p>}
      <div className="flex justify-center mt-8"><button onClick={explore} disabled={!canExplore} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-3 rounded-xl font-semibold transition">Explore Now</button></div>
    </div>
  );
}

export default SearchBar;
