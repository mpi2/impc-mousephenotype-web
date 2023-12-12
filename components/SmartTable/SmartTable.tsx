import { Form } from "react-bootstrap";
import SortableTable from "@/components/SortableTable";
import Pagination from "@/components/Pagination";
import React, { ReactElement, useState } from "react";
import { TableCellProps } from "@/models/TableCell";
import _ from "lodash";
import type { Model } from "@/models";


const SmartTable = <T extends Model>(props: {
  columns: Array<{ width: number; label: string; field: keyof T, cmp: ReactElement<TableCellProps<T>> }>,
  data: Array<T>,
  defaultSort: [string, "asc" | "desc"],
  zeroResulsText?: string;
  filterFn?: (item: T, query: string) => boolean,
}) => {
  const [query, setQuery] = useState(undefined);
  const [sortOptions, setSortOptions] = useState<string>('');

  let mutatedData = props.data;
  if (props.filterFn) {
    mutatedData = mutatedData.filter(item => props.filterFn(item, query));
  }
  const [field, order] = sortOptions.split(';');
  mutatedData = field && order ? _.orderBy(mutatedData, field, order as "asc" | "desc") : mutatedData ;

  return (
    <Pagination
      data={mutatedData}
      additionalTopControls={
        <Form.Control
          type="text"
          style={{
            display: "inline-block",
            width: 200,
            marginRight: "2rem",
          }}
          aria-label="Filter by parameters"
          id="parameterFilter"
          className="bg-white"
          placeholder="Search "
          onChange={(el) => {
            setQuery(el.target.value.toLowerCase() || undefined);
          }}
        ></Form.Control>
      }
    >
      {(pageData) => (
        <SortableTable
          doSort={([field, order]) => {
            setSortOptions(`${field};${order}`);
          }}
          defaultSort={props.defaultSort}
          headers={props.columns.map(({ field, cmp, ...rest }) => rest)}
        >
          {pageData.map((d) => (
            <tr>
              {props.columns.map(({ field, cmp }) => (
                <td>{React.cloneElement(cmp, { value: d, field })}</td>
              ))}
            </tr>
          ))}
          {(pageData.length === 0 && !!props.zeroResulsText) && (
            <tr>
              <td colSpan={7}>
                <b>{props.zeroResulsText}</b>
              </td>
            </tr>
          )}
        </SortableTable>
      )}
    </Pagination>
  )
};

export default SmartTable;