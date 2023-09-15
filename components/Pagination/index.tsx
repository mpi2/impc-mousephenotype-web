import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";


type Props = {
  data: any;
  children: any;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  page?: number;
  pageSize?: number;
  controlled?: boolean;
}
const Pagination = ({data, children, totalItems, onPageChange, onPageSizeChange, page, pageSize, controlled = false }: Props) => {
  const [internalPage, setInternalPage] = useState(page);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const currentPage = controlled ? data : data?.slice(internalPageSize * internalPage, internalPageSize * (internalPage + 1)) || [];
  const noTotalItems = controlled ? totalItems : (data?.length || 1);
  let totalPages = data ? Math.ceil(noTotalItems / internalPageSize) : 1;

  const canGoBack = internalPage >= 1;
  const canGoForward = internalPage + 1 < totalPages;

  const updatePage = (value: number) => {
    setInternalPage(value);
    if (onPageChange) {
      onPageChange(value);
    }
  }

  const updatePageSize = (value: number) => {
    setInternalPageSize(value);
    if (onPageSizeChange) {
      onPageSizeChange(value);
    }
  }


  useEffect(() => {
    // only set internal page as 0 if component is *uncontrolled*
    // meaning it will receive all the data in one go and won't need to fetch data
    // for each page
    if (!controlled) {
      setInternalPage(0);
    }
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
          Rows per page:&nbsp;
          <select
            onChange={(e) => {
              const value = Number(e.target.value);
              const newPage = value > internalPageSize ? 0 : Math.round((internalPageSize / value) * internalPage);
              updatePage(newPage);
              updatePageSize(value);
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
            onClick={() => updatePage(internalPage - 1)}
            disabled={!canGoBack}
            className={canGoBack ? "primary" : ""}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>&nbsp;
          Page {internalPage + 1} <span className="grey">/{totalPages}</span>
          <button
            style={{
              outline: "none",
              border: 0,
              background: "transparent",
              padding: "0 10px",
            }}
            onClick={() => updatePage(internalPage + 1)}
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
