import { Button, Pagination } from "react-bootstrap";

import "./PaginationControls.css";

const PaginationControls = ({
  currentPage = 1,
  isLoading = false,
  items,
  lastPage = 1,
  nextPage,
  onPageChange,
  prevPage,
}) => (
  <div className="pagination-bar">
    <Button
      variant="outline-primary"
      disabled={!prevPage || isLoading}
      onClick={() => onPageChange(prevPage)}
    >
      Previous
    </Button>

    {items ? (
      // Search pages pass explicit page numbers; simple pages show only text.
      <Pagination className="results-pagination">
        {items.map((item) =>
          typeof item === "string" ? (
            <Pagination.Ellipsis key={item} disabled />
          ) : (
            <Pagination.Item
              key={item}
              active={item === currentPage}
              disabled={isLoading}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Pagination.Item>
          ),
        )}
      </Pagination>
    ) : (
      <span className="page-indicator">
        Page {currentPage} of {lastPage}
      </span>
    )}

    <Button
      variant="outline-primary"
      disabled={!nextPage || isLoading}
      onClick={() => onPageChange(nextPage)}
    >
      Next
    </Button>
  </div>
);

export default PaginationControls;
