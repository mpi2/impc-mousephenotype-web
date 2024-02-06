import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';

type Props<T> = {
  fileName: string;
  data: Array<T>;
  fields: Array<{
    key: keyof T,
    label: string,
    getValueFn?: (data: T) => string,
  }>
}

const DownloadDataComponent = <T,>({data, fields, fileName}: Props<T>) => {
  const generateXlsxFile = () => {
    const rows = data.map(item => {
      return fields.reduce((obj, field) => {
        obj[field.label] = !!field.getValueFn ? field.getValueFn(item) : item[field.key] as string;
        return obj;
      }, {});
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data sheet");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };


  return (
    <p className="mt-4 grey">
      Download data as:{" "}
      <Button
        size="sm"
        variant="outline-secondary"
        as="button"
        target="_blank"
      >
        <FontAwesomeIcon icon={faDownload} size="sm"/> TSV
      </Button>{" "}
      <Button
        size="sm"
        variant="outline-secondary"
        as="button"
        target="_blank"
        onClick={generateXlsxFile}
      >
        <FontAwesomeIcon icon={faDownload} size="sm"/> XLS
      </Button>
    </p>
  );
};

export default DownloadDataComponent;