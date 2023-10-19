import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from './styles.module.scss';


type Props = {
  data: any;
  children: any;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  page?: number;
  pageSize?: number;
  controlled?: boolean;
  buttonsPlacement?: 'top' | 'bottom' | 'both'
  additionalTopControls?: React.ReactElement | null,
}
const Pagination = (props: Props) => {
  const {
    data,
    children,
    totalItems,
    onPageChange,
    onPageSizeChange,
    page = 0,
    pageSize,
    controlled = false,
    buttonsPlacement = 'both',
    additionalTopControls: AdditionalTopControls = null,
  } = props;

  const [internalPage, setInternalPage] = useState(page);
  const [internalPageSize, setInternalPageSize] = useState(10);
  const [pageRange, setPageRange] = useState([1, 2, 3]);


  const currentPage = controlled ? data : data?.slice(internalPageSize * internalPage, internalPageSize * (internalPage + 1)) || [];
  const noTotalItems = controlled ? totalItems : (data?.length || 1);
  let totalPages = Math.ceil(noTotalItems / internalPageSize) || 1;
  const updatePageRange = (page: number, totalPages: number) => {
    let rangeStart = Math.max(1, page - 1);
    let rangeEnd = Math.min(totalPages, page + 3);

    if (rangeEnd - rangeStart < 4) {
      // If the range is too small, adjust it to always show 5 pages
      if (page <= 3) {
        rangeEnd = Math.min(totalPages, 5);
      }
    }

    setPageRange(
      Array.from(
        { length: rangeEnd - rangeStart + 1},
        (_, i) => rangeStart + i
      )
    );
  };

  const canGoBack = internalPage >= 1;
  const canGoForward = internalPage + 1 < totalPages;

  useEffect(() => {
    updatePageRange(internalPage, totalPages);
  }, [data, internalPage, internalPageSize]);


  const NavButtons = ({ shouldBeDisplayed, placement }: { shouldBeDisplayed: boolean, placement: 'top' | 'bottom' }) => {
    if (shouldBeDisplayed) {
      return (
        <ul
          className={`pagination justify-content-center ${styles.paginationNav}`}
          data-testid={`nav-buttons-${placement}`}
        >
          <button
            onClick={() => updatePage(internalPage - 1)}
            disabled={!canGoBack}
            className={canGoBack ? "nav-btn primary" : "nav-btn"}
            data-testid="prev-page"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>&nbsp;
          {pageRange[0] > 1 && (
            <>
              <li
                className={`page-item first-page ${internalPage === 0 ? "active" : ""}`}
                data-testid="first-page"
              >
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => updatePage(0)}
                  data-testid="first-page-btn"
                >
                  <span aria-hidden="true">1</span>
                </button>
              </li>
              {pageRange[0] > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}
          {pageRange.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${
                internalPage === (pageNumber - 1) ? "active" : ""
              }`}
              data-testid={`page-${pageNumber}`}
            >
              <button
                className="page-link"
                onClick={() => updatePage(pageNumber - 1)}
                data-testid={`page-${pageNumber}-btn`}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          {pageRange[pageRange.length - 1] < totalPages && (
            <>
              {pageRange[pageRange.length - 2] < totalPages && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li
                className={`page-item ${
                  internalPage === totalPages ? "active" : ""
                }`}
                data-testid="last-page"
              >
                <button
                  className="page-link last-page"
                  aria-label="Previous"
                  onClick={() => updatePage(totalPages - 1)}
                  data-testid="last-page-btn"
                >
                  <span aria-hidden="true">{totalPages}</span>
                </button>
              </li>
            </>
          )}
          <button
            onClick={() => updatePage(internalPage + 1)}
            disabled={!canGoForward}
            className={canGoForward ? "nav-btn primary" : "nav-btn"}
            data-testid="next-page"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </ul>
      );
    }
    return null;
  };

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

  const shouldDisplayTopButtons = buttonsPlacement === 'top' || buttonsPlacement === 'both';
  const shouldDisplayBottomButtons = buttonsPlacement === 'bottom' || buttonsPlacement === 'both';

  return (
    <>
      <div className={`${styles.buttonsWrapper} ${!!AdditionalTopControls ? styles.withControls : ''}`}>
        { !!AdditionalTopControls && (
          <div className={styles.additionalWrapper}>
            { AdditionalTopControls }
          </div>
        )}
        <NavButtons placement="top" shouldBeDisplayed={shouldDisplayTopButtons} />
      </div>
      {children(currentPage)}
      <div className={styles.buttonsWrapper}>
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
        <NavButtons placement="bottom" shouldBeDisplayed={shouldDisplayBottomButtons} />
      </div>
    </>
  );
};

export default Pagination;
