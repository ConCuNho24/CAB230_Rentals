import {
  formatMoney,
  formatPropertyType,
  formatRating,
} from "../../utils/formatters";

export const RentalTitleCell = ({ fallback, rental }) => (
  <td className="rental-title-column">{rental?.title || fallback}</td>
);

export const RentalFactsCells = ({
  includeAverageRating = false,
  includePostcode = false,
  rental,
}) => (
  <>
    <td>{rental ? formatMoney(rental.rent) : "Unavailable"}</td>
    <td>{rental ? formatPropertyType(rental.propertyType) : "Unavailable"}</td>
    <td>{rental?.suburb || "Unavailable"}</td>
    <td>{rental?.state || "Unavailable"}</td>
    {includePostcode && <td>{rental?.postcode || "Unavailable"}</td>}
    <td>{rental?.bedrooms ?? "Unavailable"}</td>
    <td>{rental?.bathrooms ?? "Unavailable"}</td>
    <td>{rental?.parkingSpaces ?? "Unavailable"}</td>
    {includeAverageRating && (
      <td>
        {rental
          ? formatRating(rental.averageRating, rental.numRatings)
          : "Unavailable"}
      </td>
    )}
  </>
);
