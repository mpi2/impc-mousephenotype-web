import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import styles from "./styles.module.scss";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

type SortType = [string | ((any) => void), "asc" | "desc"];

type Header = {
  width: number;
  label: string;
  field?: string;
  sortFn?: (any) => void;
  disabled?: boolean;
  children?: Header[];
};

const SortableTable = ({
  headers,
  defaultSort,
  doSort,
  children,
}: {
  headers: Header[];
  defaultSort?: SortType;
  doSort?: (s: SortType) => void;
  children: React.ReactNode;
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
  }: Header) => {
    const selected = field === sort.field;
    const handleSelect = () => {
      if (disabled) return;
      if (selected) {
        setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" });
      } else {
        setSort({
          ...sort,
          field,
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
      <Table bordered className={`${styles.table} ${styles.striped}`}>
        {hasNested &&
          headers.map(({children: childHeaders}) => {
            if (childHeaders && childHeaders.length) {
              return <colgroup span={childHeaders.length}/>;
            }
            return <col/>;
          })}
        <thead>
        <tr>
          {headers.map((header, index) => (
            <SortableTh key={index} {...header} />
          ))}
        </tr>
        {hasNested &&
          headers.map(({children: childHeaders}) => {
            if (childHeaders && childHeaders.length) {
              return childHeaders.map((childHeader) => (
                  <SortableTh {...childHeader} />
                ));
              }
            })}
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
};

export default SortableTable;
