import { useEffect, useState } from "react";

export const usePagination = <T,>(data: Array<T> = []) => {
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data.length / pageSize)
  );

  const paginatedData = data.slice(
    (activePage - 1) * pageSize,
    (activePage - 1) * pageSize + pageSize
  );

  useEffect(() => {
    setTotalPages(prevState => {
      const newTotal = Math.ceil(data.length / pageSize);
      if (prevState !== newTotal) {
        return newTotal;
      }
      return prevState;
    });
  }, [pageSize, data.length]);

  useEffect(() => {
    setActivePage(prevState => {
      if (prevState !== 1) {
        return 1;
      }
      return prevState;
    });
  }, [data.length]);

  return {
    activePage,
    setActivePage,
    pageSize,
    setPageSize,
    totalPages,
    setTotalPages,
    paginatedData,
  }
}