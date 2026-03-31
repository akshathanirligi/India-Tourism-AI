import { useMemo } from "react";

// These CDN URLs are deliberately fixed. The previous implementation searched
// Wikimedia from every card in the browser, then rejected most search results.
// That made generic/generated destinations end up as "Image not available".
const imagesByCategory = [
  { terms: ["temple", "pilgrimage", "spiritual", "mosque", "church", "shrine", "monastery", "jain"], src: "https://unsplash.com/photos/fY-ArEvk7sc/download?force=true&w=1200" },
  { terms: ["beach", "coast", "island", "seafront"], src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["river", "ghat"], src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["waterfall", "falls"], src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["wildlife", "sanctuary", "national park", "forest"], src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["fort", "heritage", "monument", "museum", "architecture", "landmark"], src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["palace"], src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["lake"], src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["garden", "park", "nature"], src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85" },
  { terms: ["hill", "mountain", "valley", "peak", "viewpoint", "trek", "adventure"], src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" },
];

const defaultImage = "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85";

const getImage = (category = "") => {
  const normalized = category.toLowerCase();
  return imagesByCategory.find(({ terms }) => terms.some((term) => normalized.includes(term)))?.src || defaultImage;
};

// If a network, extension, or CDN policy blocks the photo, keep the card visual
// instead of showing a broken-image message.
const makeFallback = (name = "India Tourism") => `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#075985"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>
    <rect width="1200" height="700" fill="url(#sky)"/>
    <path d="M0 510 260 270l180 160 170-225 330 305v190H0Z" fill="#0e7490" opacity=".8"/>
    <path d="m480 510 180-205 110 120 95-105 335 190v190H0V590Z" fill="#164e63"/>
    <text x="600" y="610" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="42" font-weight="700">${name.replace(/[<>&]/g, "")}</text>
  </svg>` )}`;

function DestinationImage({ place, className = "" }) {
  const source = useMemo(() => place.imageUrl || getImage(place.category), [place.category, place.imageUrl]);
  const fallback = makeFallback(place.placeName);
  const handleError = (event) => {
    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
  };

  return <img key={source} src={source} alt={place.placeName || "Tourist destination"} className={`h-full w-full object-cover transition duration-500 group-hover:scale-110 ${className}`} loading="lazy" onError={handleError} />;
}

export default DestinationImage;
