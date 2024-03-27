import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

type Props<T> = {
  fileName: string;
  data: Array<T>;
  fields: Array<{
    key: keyof T;
    label: string;
    getValueFn?: (data: T) => string;
  }>;
};

const DownloadDataComponent = <T,>({ data, fields, fileName }: Props<T>) => {
  const generateXlsxFile = () => {
    const rows = data.map((item) => {
      return fields.reduce((obj, field) => {
        obj[field.label] = !!field.getValueFn
          ? field.getValueFn(item)
          : (item[field.key] as string);
        return obj;
      }, {});
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data sheet");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const generateTsvFile = () => {
    const headers = fields.map((field) => field.label);
    const rows = data.map((item) => {
      return fields.map((field) =>
        !!field.getValueFn
          ? field.getValueFn(item)
          : (item[field.key] as string)
      );
    });
    const finalData = [headers, ...rows];
    const tsvContent = finalData.reduce((content, row) => {
      content += `${row.join("\t")}\n`;
      return content;
    }, "");
    const blob = new Blob([tsvContent], {
      type: "text/tab-separated-value;charset=utf-8",
    });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", objUrl);
    link.setAttribute("download", `${fileName}.tsv`);
    link.click();
    URL.revokeObjectURL(objUrl);
  };

  return (
    <div className="grey" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      Download data as:{" "}
      <button
        className="btn impc-secondary-button small"
        onClick={generateTsvFile}
      >
        <FontAwesomeIcon icon={faDownload} size="sm" /> TSV
      </button>{" "}
      <button
        className="btn impc-secondary-button small"
        onClick={generateXlsxFile}
      >
        <FontAwesomeIcon icon={faDownload} size="sm" /> XLS
      </button>
    </div>
  );
};

export default DownloadDataComponent;
