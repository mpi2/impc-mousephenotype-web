import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


type Props = {
  data: any;
  children: any;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
}
const Pagination = ({ data, children, totalItems, onPageChange }: Props) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const currentPage = data?.slice(pageSize * page, pageSize * (page + 1)) || [];
  const noTotalItems = totalItems ? totalItems : data.length;
  const totalPages = data ? Math.ceil(noTotalItems / pageSize) : 1;

  const canGoBack = page >= 1;
  const canGoForward = page + 1 < totalPages;

  const updatePage = (value: number) => {
    setPage(value);
    if (onPageChange) {
      onPageChange(value);
    }
  }

  useEffect(() => {
    setPage(0);
  }, [data]);

  return (
    <>
      {children(currentPage)}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          Rows per page:{" "}
          <select
            onChange={(e) => {
              const value = Number(e.target.value);
              const newPage = Math.round((pageSize / value) * page);
              setPageSize(value);
              updatePage(newPage);
            }}
            value={pageSize}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div>
          <button
            style={{
              outline: "none",
              border: 0,
              background: "transparent",
              padding: "0 10px",
            }}
            onClick={() => updatePage(page - 1)}
            disabled={!canGoBack}
            className={canGoBack ? "primary" : ""}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>{" "}
          Page {page + 1} <span className="grey">/{totalPages}</span>
          <button
            style={{
              outline: "none",
              border: 0,
              background: "transparent",
              padding: "0 10px",
            }}
            onClick={() => updatePage(page + 1)}
            disabled={!canGoForward}
            className={canGoForward ? "primary" : ""}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
