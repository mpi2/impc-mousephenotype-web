import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
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
    page,
    pageSize,
    controlled = false,
    buttonsPlacement = 'bottom',
    additionalTopControls: AdditionalTopControls = null,
  } = props;
  console.log(data);
  const [internalPage, setInternalPage] = useState(page);
  const [internalPageSize, setInternalPageSize] = useState(10);

  const currentPage = controlled ? data : data?.slice(internalPageSize * internalPage, internalPageSize * (internalPage + 1)) || [];
  const noTotalItems = controlled ? totalItems : (data?.length || 1);
  let totalPages = data ? Math.ceil(noTotalItems / internalPageSize) : 1;

  const canGoBack = internalPage >= 1;
  const canGoForward = internalPage + 1 < totalPages;

  const NavButtons = ({ shouldBeDisplayed }: { shouldBeDisplayed: boolean }) => {
    if (shouldBeDisplayed) {
      return (
        <div>
          <button
            onClick={() => updatePage(internalPage - 1)}
            disabled={!canGoBack}
            className={canGoBack ? "nav-btn primary" : "nav-btn"}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>&nbsp;
          Page {internalPage + 1} <span className="grey">/{totalPages}</span>
          <button
            onClick={() => updatePage(internalPage + 1)}
            disabled={!canGoForward}
            className={canGoForward ? "nav-btn primary" : "nav-btn"}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
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
        <NavButtons shouldBeDisplayed={shouldDisplayTopButtons} />
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
        <NavButtons shouldBeDisplayed={shouldDisplayBottomButtons} />
      </div>
    </>
  );
};

export default Pagination;
