import {
  RentalFactsCells,
  RentalTitleCell,
} from "../../components/results/RentalTableCells";
import { rentalSearchColumns } from "../../components/results/resultColumns";
import ResultsTable from "../../components/results/ResultsTable";

const RentalSearchResults = ({
  errorMessage,
  isLoading,
  onLoadMore,
  onSelectRental,
  pagination,
  rentals,
}) => (
  <ResultsTable
    columns={rentalSearchColumns}
    emptyMessage="No rentals match this search."
    errorMessage={errorMessage}
    getRowKey={(rental) => rental.id}
    hasNextPage={Boolean(pagination.nextPage)}
    isLoading={isLoading}
    loadingMessage="Loading rentals..."
    onLoadMore={onLoadMore}
    rows={rentals}
    total={pagination.total || 0}
    renderRow={(rental) => (
      <tr onClick={() => onSelectRental(rental)}>
        <RentalTitleCell rental={rental} />
        <RentalFactsCells
          rental={rental}
          includePostcode
          includeAverageRating
        />
      </tr>
    )}
  />
);

export default RentalSearchResults;
