function UserLocationMap({ destinationLat, destinationLng, placeName }) {
  const latitude = Number(destinationLat);
  const longitude = Number(destinationLng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return (
      <p className="rounded-xl bg-slate-100 p-4 text-slate-600">
        This place does not have valid map coordinates yet.
      </p>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=13&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <iframe
        title={`Map of ${placeName}`}
        src={mapUrl}
        className="h-[450px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default UserLocationMap;
