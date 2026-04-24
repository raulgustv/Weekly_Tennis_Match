import { Button } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {FileExcelOutlined} from "@ant-design/icons"

const ExportToExcel = ({ data, fileName = "export.xlsx" }) => {
  const handleExport = () => {
    if (!data?.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, fileName);
  };

  return (
    <Button type="primary" onClick={handleExport} icon={<FileExcelOutlined />} style={{margin: 10}}>
      Export to Excel
    </Button>
  );
};

export default ExportToExcel;