import { Map, Marker } from "pigeon-maps";

import "./RentalMap.css";

const hasLocation = (rental) =>
  Number.isFinite(Number(rental?.latitude)) &&
  Number.isFinite(Number(rental?.longitude));

const getMapCenter = (rentals) => {
  const rentalsWithLocation = rentals.filter(hasLocation);

  // Default to the centre of Australia when no coordinates are available.
  if (rentalsWithLocation.length === 0) return [-25.2744, 133.7751];

  const totals = rentalsWithLocation.reduce(
    (sum, rental) => ({
      latitude: sum.latitude + Number(rental.latitude),
      longitude: sum.longitude + Number(rental.longitude),
    }),
    { latitude: 0, longitude: 0 },
  );

  return [
    totals.latitude / rentalsWithLocation.length,
    totals.longitude / rentalsWithLocation.length,
  ];
};

const RentalMap = ({
  activeRentalId,
  height = 360,
  onSelectRental,
  rentals = [],
  zoom = 11,
}) => {
  // The map only renders markers for rentals with usable coordinates.
  const rentalsWithLocation = rentals.filter(hasLocation);
  const center = getMapCenter(rentalsWithLocation);

  return (
    <div className="map-container">
      <Map height={height} defaultCenter={center} center={center} defaultZoom={zoom}>
        {rentalsWithLocation.map((rental) => (
          <Marker
            key={rental.id}
            width={activeRentalId === rental.id ? 46 : 34}
            anchor={[Number(rental.latitude), Number(rental.longitude)]}
            color={activeRentalId === rental.id ? "#dc2626" : "#2563eb"}
            onClick={() => onSelectRental?.(rental)}
          />
        ))}
      </Map>
    </div>
  );
};

export default RentalMap;
