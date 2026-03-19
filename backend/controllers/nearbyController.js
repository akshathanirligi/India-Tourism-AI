// Public OpenStreetMap Overpass instances. They need neither an API key nor billing.
const OVERPASS_URLS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const CACHE_TTL_MS = 5 * 60 * 1000;
const OVERPASS_TIMEOUT_MS = 15000;
const DEFAULT_RADIUS_METERS = 2000;
const MAX_RADIUS_METERS = 250000;
const MAX_RESULTS = 25;
const OVERPASS_RESULT_LIMIT = 50;
const nearbyCache = new Map();
const addressCache = new Map();
const NOMINATIM_URL = process.env.NOMINATIM_URL || "https://nominatim.openstreetmap.org/reverse";
const NOMINATIM_MIN_INTERVAL_MS = 1100;
let nextNominatimRequestAt = 0;

const serviceTypes = {
  // Both tags are in active use in OpenStreetMap, especially on older data.
  hospital: { label: "Hospitals", fallbackName: "Hospital", queries: ['["amenity"="hospital"]', '["healthcare"="hospital"]'] },
  bank: { label: "Banks", fallbackName: "Bank", query: '["amenity"="bank"]' },
  atm: { label: "ATMs", fallbackName: "ATM", query: '["amenity"="atm"]' },
  fuel: { label: "Petrol Pumps", fallbackName: "Petrol Pump", query: '["amenity"="fuel"]' },
  police: { label: "Police Stations", fallbackName: "Police Station", query: '["amenity"="police"]' },
  pharmacy: { label: "Pharmacies", fallbackName: "Pharmacy", query: '["amenity"="pharmacy"]' },
  restaurant: { label: "Restaurants", fallbackName: "Restaurant", query: '["amenity"="restaurant"]' },
  hotel: { label: "Hotels", fallbackName: "Hotel", query: '["tourism"~"^(hotel|guest_house|hostel)$"]' },
  bus_stop: { label: "Bus Stops", fallbackName: "Bus Stop", query: '["highway"="bus_stop"]' },
  railway_station: { label: "Railway Stations", fallbackName: "Railway Station", query: '["railway"="station"]' },
  toilets: { label: "Public Toilets", fallbackName: "Public Toilet", query: '["amenity"="toilets"]' },
};

const toRadians = (value) => (value * Math.PI) / 180;
const getDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(toLat - fromLat);
  const lngDelta = toRadians(toLng - fromLng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getElementCoordinates = (element) => {
  if (Number.isFinite(element.lat) && Number.isFinite(element.lon)) {
    return { latitude: element.lat, longitude: element.lon };
  }
  if (Number.isFinite(element.center?.lat) && Number.isFinite(element.center?.lon)) {
    return { latitude: element.center.lat, longitude: element.center.lon };
  }
  return null;
};

const getAddress = (tags) => {
  const parts = [
    tags["addr:housenumber"], tags["addr:street"], tags["addr:suburb"],
    tags["addr:city"] || tags["addr:town"] || tags["addr:village"],
    tags["addr:district"] || tags["addr:county"], tags["addr:state"], tags["addr:postcode"], tags["addr:country"],
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : tags["addr:full"] || tags["contact:address"] || "Address unavailable";
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getReadableAddress = (address, fallbackAddress) => {
  const street = [address.house_number, address.road || address.pedestrian || address.footway || address.path].filter(Boolean).join(" ");
  const city = address.city || address.town || address.village || address.municipality || address.locality || address.suburb || address.neighbourhood;
  const district = address.city_district || address.state_district || address.county || address.district;
  const parts = [street, city, district, address.state, address.postcode, address.country]
    .filter(Boolean)
    .filter((part, index, all) => all.findIndex((candidate) => candidate.toLowerCase() === part.toLowerCase()) === index);
  return parts.join(", ") || fallbackAddress;
};

const reverseGeocodeAddress = async (latitude, longitude, fallbackAddress) => {
  const cacheKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  if (addressCache.has(cacheKey)) return addressCache.get(cacheKey);

  const lookup = (async () => {
    const requestAt = Math.max(Date.now(), nextNominatimRequestAt);
    nextNominatimRequestAt = requestAt + NOMINATIM_MIN_INTERVAL_MS;
    await sleep(Math.max(0, requestAt - Date.now()));

    try {
      const requestUrl = `${NOMINATIM_URL}?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
      const response = await fetch(requestUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "India-Tourism-AI/1.0 (nearby address enhancement)",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Nominatim returned HTTP ${response.status}`);
      const data = await response.json();
      // `display_name` remains a useful final fallback for sparse OSM records
      // that do not expose structured address components.
      return getReadableAddress(data.address || {}, data.display_name || fallbackAddress);
    } catch {
      return fallbackAddress;
    }
  })();

  addressCache.set(cacheKey, lookup);
  return lookup;
};

const buildSearchRadii = (initialRadius, maxRadius) => {
  const radii = [];
  let radius = initialRadius;
  while (radius < maxRadius) {
    radii.push(radius);
    radius *= 2;
  }
  radii.push(maxRadius);
  return [...new Set(radii)];
};

const buildQuery = (radius, latitude, longitude, service) => {
  const queries = service.queries || [service.query];
  // `nwr` expands to a costly combined lookup and causes Overpass to time out
  // for common categories (notably banks and ATMs). Query each element type
  // explicitly: it returns exactly the same objects while letting Overpass use
  // its element-type indexes.
  const selectors = queries
    .flatMap((query) => ["node", "way", "relation"].map((elementType) => (
      `${elementType}(around:${radius},${latitude},${longitude})${query};`
    )))
    .join("");
  // Apply the limit in Overpass before data is transferred.
  return `[out:json][timeout:20];(${selectors});out center tags ${OVERPASS_RESULT_LIMIT};`;
};

const getErrorDetails = (error) => ({
  code: error.code || error.status || error.response?.status || error.name || "UNKNOWN",
  message: error.responseData?.remark || error.response?.data?.remark || error.message || "Unknown Overpass error",
});

const fetchFromOverpass = async (query) => {
  const failures = [];
  for (const url of OVERPASS_URLS) {
    try {
      // Axios was receiving 504/timeouts here, while native fetch with an
      // explicitly encoded GET URL succeeds against the same Overpass query.
      const requestUrl = `${url}?data=${encodeURIComponent(query)}`;
      const response = await fetch(requestUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "India-Tourism-AI/1.0 (free nearby services)",
        },
        signal: AbortSignal.timeout(OVERPASS_TIMEOUT_MS),
      });
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }
      if (!response.ok) {
        const error = new Error(`Overpass returned HTTP ${response.status}`);
        error.status = response.status;
        error.responseData = data;
        throw error;
      }
      const elements = Array.isArray(data?.elements) ? data.elements : [];
      return { elements, url };
    } catch (error) {
      const details = { url, ...getErrorDetails(error) };
      failures.push(details);
    }
  }
  const error = new Error(failures.map((failure) => `${failure.url}: ${failure.code} ${failure.message}`).join(" | ") || "No Overpass server is available.");
  error.failures = failures;
  throw error;
};

const formatResults = async (elements, latitude, longitude, service) => {
  const seen = new Set();
  const places = elements
    .map((element) => {
      const coordinates = getElementCoordinates(element);
      if (!coordinates) return null;
      const tags = element.tags || {};
      return {
        id: `${element.type}-${element.id}`,
        name: tags.name || service.fallbackName,
        address: getAddress(tags),
        distanceKm: Number(getDistanceKm(latitude, longitude, coordinates.latitude, coordinates.longitude).toFixed(1)),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .filter((place) => {
      const key = `${place.name}:${place.latitude.toFixed(4)}:${place.longitude.toFixed(4)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_RESULTS);

  return Promise.all(places.map(async (place) => ({
    ...place,
    address: await reverseGeocodeAddress(place.latitude, place.longitude, place.address),
  })));
};

const getNearbyPlaces = async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lng);
  const type = String(req.query.type || "").trim().toLowerCase();
  const service = serviceTypes[type];

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return res.status(400).json({ message: "Valid latitude and longitude query parameters are required." });
  }
  if (!service) {
    return res.status(400).json({ message: "Unsupported nearby service type." });
  }

  // The server controls the radius escalation so a client cannot accidentally
  // hide an essential service by imposing a small search radius.
  const initialRadius = DEFAULT_RADIUS_METERS;
  const cacheKey = `${type}:${latitude.toFixed(3)}:${longitude.toFixed(3)}:${initialRadius}`;
  const cached = nearbyCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return res.json(cached.payload);
  }

  try {
    for (const radiusMeters of buildSearchRadii(initialRadius, MAX_RADIUS_METERS)) {
      const query = buildQuery(radiusMeters, latitude, longitude, service);
      const { elements } = await fetchFromOverpass(query);
      const results = await formatResults(elements, latitude, longitude, service);
      if (results.length) {
        const payload = { source: "OpenStreetMap", type, radiusMeters, results };
        nearbyCache.set(cacheKey, { createdAt: Date.now(), payload });
        return res.json(payload);
      }
    }

    const payload = { source: "OpenStreetMap", type, radiusMeters: MAX_RADIUS_METERS, results: [] };
    return res.json(payload);
  } catch (error) {
    return res.status(502).json({
      message: "Nearby services are temporarily unavailable. Please try again shortly.",
    });
  }
};

module.exports = { getNearbyPlaces, serviceTypes };
