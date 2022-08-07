import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import styles from "./styles.module.scss";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

type sortType = [string, "asc" | "desc"];

const SortableTable = ({
  headers,
  defaultSort,
  doSort,
  children,
}: {
  headers: {
    width: number;
    label: string;
    field?: string;
    disabled?: boolean;
  }[];
  defaultSort?: sortType;
  doSort?: (s: sortType) => void;
  children: React.ReactNode;
}) => {
  const [sort, setSort] = useState<[string, "asc" | "desc"]>(
    defaultSort || [headers[0].field, "asc"]
  );

  useEffect(() => {
    if (doSort) {
      doSort(sort);
    }
  }, [sort]);

  const SortableTh = ({
    label,
    field,
    width,
    disabled = false,
  }: {
    label: string;
    field?: string;
    width?: number;
    disabled?: boolean;
  }) => {
    const selected = field === sort[0];
    const handleSelect = () => {
      if (disabled) return;
      if (selected) {
        setSort([sort[0], sort[1] === "asc" ? "desc" : "asc"]);
      } else {
        setSort([field, sort[1]]);
      }
    };
    return (
      <th {...(!!width ? { width: `${(width / 12) * 100}%` } : {})}>
        <button
          style={{
            fontWeight: !disabled && selected ? "bold" : "normal",
          }}
          className={styles.inlineButton}
          onClick={handleSelect}
        >
          {label}{" "}
          {!disabled && selected && (
            <FontAwesomeIcon
              icon={sort[1] === "asc" ? faCaretUp : faCaretDown}
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <Table striped bordered className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <SortableTh {...header} />
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  );
};

export default SortableTable;
