import { Fragment, useEffect, useRef } from "react";

import { Alert, Card, Table } from "react-bootstrap";

import { LoadingMessage } from "../StatusMessage";
import { PAGE_SIZE } from "./resultsConfig";
import "./ResultsTable.css";

const ResultsTable = ({
  columns,
  emptyMessage,
  errorMessage,
  getRowKey,
  isLoading,
  loadingMessage,
  onLoadMore,
  renderRow,
  rows,
  title = "Results",
  total = 0,
  hasNextPage = false,
}) => {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasNextPage) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        onLoadMore();
      }
    });

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, onLoadMore]);

  return (
    <Card className="app-card">
      <Card.Body>
        <div className="results-toolbar">
          <h2 className="section-title">{title}</h2>
          {isLoading && rows.length === 0 && (
            <LoadingMessage message={loadingMessage} />
          )}
        </div>

        {total === 0 && !isLoading && !errorMessage && (
          <Alert variant="info">{emptyMessage}</Alert>
        )}

        {rows.length > 0 && (
          <>
            <Table hover className="rentals-table align-middle">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label} className={column.className}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const pageNumber = Math.floor(index / PAGE_SIZE) + 1;
                  const firstResultNumber = index + 1;
                  const lastResultNumber = Math.min(
                    pageNumber * PAGE_SIZE,
                    total || rows.length,
                  );
                  const showDivider = index > 0 && index % PAGE_SIZE === 0;

                  return (
                    <Fragment key={getRowKey(row)}>
                      {showDivider && (
                        <tr className="results-divider-row">
                          <td colSpan={columns.length}>
                            <span>
                              Results {firstResultNumber} to {lastResultNumber}
                            </span>
                          </td>
                        </tr>
                      )}

                      {renderRow(row)}
                    </Fragment>
                  );
                })}
              </tbody>
            </Table>

            <div ref={loadMoreRef} className="load-more-bar">
              {hasNextPage ? (
                <span>{isLoading ? "Loading More Results ..." : ""}</span>
              ) : (
                <span>End of results</span>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ResultsTable;
