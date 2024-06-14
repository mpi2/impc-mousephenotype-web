import { Form } from "react-bootstrap";
import SortableTable from "@/components/SortableTable";
import Pagination from "@/components/Pagination";
import React, { ReactElement, useState } from "react";
import { TableCellProps } from "@/models/TableCell";
import _ from "lodash";
import type { Model } from "@/models";
import Skeleton from "react-loading-skeleton";


const SmartTable = <T extends Model>(props: {
  columns: Array<{
    width: number;
    label: string;
    field?: keyof T,
    cmp: ReactElement<TableCellProps<T>>,
    // refers to disable sort functionality
    disabled?: boolean
  }>,
  data: Array<T>,
  defaultSort: [string, "asc" | "desc"],
  zeroResulsText?: string;
  filterFn?: (item: T, query: string) => boolean,
  additionalTopControls?: ReactElement,
  additionalBottomControls?: ReactElement,
  filteringEnabled?: boolean,
  // set this to false if you need more specific filtering, check All Phenotypes section
  customFiltering?: boolean,
  showLoadingIndicator?: boolean,
  customSortFunction?: (data: Array<T>, field: string, order: "asc" | "desc") => Array<T>;
}) => {
  const [query, setQuery] = useState(undefined);
  const [sortOptions, setSortOptions] = useState<string>('');
  const {
    filteringEnabled = true,
    customFiltering = false,
    zeroResulsText = 'No data available',
    showLoadingIndicator = false,
  } = props;

  const internalShowFilteringEnabled = filteringEnabled && !!props.filterFn && !customFiltering;

  let mutatedData = props.data;
  if (props.filterFn) {
    mutatedData = mutatedData?.filter(item => props.filterFn(item, query));
  }
  const [field, order] = sortOptions.split(';');
  if (field && order) {
    mutatedData = !!props.customSortFunction
      ? props.customSortFunction(mutatedData, field, order as "asc" | "desc")
      : _.orderBy(mutatedData, field, order as "asc" | "desc")
  }

  const additionalControls = internalShowFilteringEnabled ?  (
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
  ) : props.additionalTopControls

  return (
    <Pagination
      data={mutatedData}
      additionalTopControls={additionalControls}
      additionalBottomControls={props.additionalBottomControls}
    >
      {(pageData) => (
        <SortableTable
          doSort={([field, order]) => {
            setSortOptions(`${field};${order}`);
          }}
          defaultSort={props.defaultSort}
          headers={props.columns.map(
            ({ field, cmp, ...rest }) => ({
              ...rest,
              field: field as string,
            }))
          }
        >
          {pageData.map((d, index) => (
            <tr key={index}>
              {props.columns.map(({ field, cmp }, index) => (
                <td key={index}>
                  {React.cloneElement(cmp, { value: d, field })}
                </td>
              ))}
            </tr>
          ))}
          {(pageData.length === 0 && showLoadingIndicator) && (
            <tr>
              {props.columns.map((_, index) => (
                <td key={index}>
                  <Skeleton />
                </td>
              ))}
            </tr>
          )}
          {(pageData.length === 0 && !showLoadingIndicator) && (
            <tr>
              <td colSpan={props.columns.length}>
                <b>{zeroResulsText}</b>
              </td>
            </tr>
          )}
        </SortableTable>
      )}
    </Pagination>
  )
};

export default SmartTable;