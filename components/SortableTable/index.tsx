import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { TableHeader } from "@/models";

type SortType = [string | ((any) => void), "asc" | "desc"];

const SortableTable = ({
  headers,
  defaultSort,
  doSort,
  children,
  className,
}: {
  headers: TableHeader[];
  defaultSort?: SortType;
  doSort?: (s: SortType) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  // TODO: add search filter
  const [sort, setSort] = useState<{
    field: string | undefined;
    sortFn: (any) => void | undefined;
    order: SortType[1];
  }>(
    defaultSort
      ? {
          ...(typeof defaultSort[0] === "string"
            ? { field: defaultSort[0], sortFn: undefined }
            : { sortFn: defaultSort[0], field: undefined }),
          order: defaultSort[1],
        }
      : {
          field: headers[0].field,
          sortFn: headers[0].sortFn,
          order: "asc",
        }
  );

  const hasNested = headers.some(({ children }) => children && children.length);

  const getSortOptions = (): SortType => [
    sort.sortFn ?? sort.field,
    sort.order,
  ];

  useEffect(() => {
    if (doSort) {
      doSort(getSortOptions());
    }
  }, [sort]);

  const SortableTh = ({
    label,
    field,
    sortFn,
    width,
    disabled = false,
    children: childHeader,
    sortField,
  }: TableHeader) => {
    const selected = field === sort.field || sortField === sort.field;
    const handleSelect = () => {
      if (disabled) return;
      if (selected) {
        setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" });
      } else {
        setSort({
          ...sort,
          field: !!sortField ? sortField : field,
          sortFn,
        });
      }
    };
    return (
      <th
        {...(!!width ? { width: `${(width / 12) * 100}%` } : {})}
        {...(hasNested && childHeader && childHeader.length
          ? { colSpan: childHeader.length, scope: "colGroup" }
          : { rowSpan: 2 })}
      >
        {!!label && (
          <button
            style={{
              fontWeight: !disabled && selected ? "bold" : "normal",
            }}
            className={`${styles.inlineButton} ${styles.headerButton}`}
            onClick={handleSelect}
          >
            {label}{" "}
            {!disabled && selected && (
              <FontAwesomeIcon
                className={styles.sortIcon}
                icon={sort.order === "asc" ? faCaretUp : faCaretDown}
              />
            )}
            {!disabled && !selected && (
              <span className={styles.defaultIcons}>
              <FontAwesomeIcon className={styles.first} icon={faCaretUp}/>
              <FontAwesomeIcon className={styles.second} icon={faCaretDown}/>
            </span>
            )}
          </button>
        )}
      </th>
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <Table bordered className={`${styles.table} ${styles.striped} ${className}`}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <SortableTh key={index} {...header} />
            ))}
          </tr>
          <tr>
          {hasNested &&
            headers.map(({children: childHeaders}) => {
            if (childHeaders && childHeaders.length) {
              return childHeaders.map((childHeader) => (
                  <SortableTh {...childHeader} />
                ));
              }
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
};

export default SortableTable;
