'use strict';

// src/lib/pivot/export.ts
async function exportPivotData(data, format) {
  switch (format) {
    case "csv":
      return generateCSV(data);
    case "excel":
      return await generateExcel(data);
    case "json":
      return JSON.stringify(data, null, 2);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
function generateCSV(data) {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]).filter((key) => !key.startsWith("__"));
  const header = keys.join(",");
  const rows = data.map((row) => {
    return keys.map((key) => {
      const value = row[key];
      if (value === null || value === void 0) return "";
      const strValue = String(value);
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    }).join(",");
  });
  return [header, ...rows].join("\n");
}
async function generateExcel(data) {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Pivot Data");
  if (data.length === 0) {
    return new Blob([], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  const keys = Object.keys(data[0]).filter((key) => !key.startsWith("__"));
  worksheet.addRow(keys);
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" }
  };
  data.forEach((row) => {
    const values = keys.map((key) => row[key]);
    const excelRow = worksheet.addRow(values);
    if (row.__isGrandTotal || row.__isSubtotal) {
      excelRow.font = { bold: true };
      excelRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: row.__isGrandTotal ? "FFFFEB3B" : "FFFFFFFF" }
      };
    }
  });
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      const length = String(cell.value).length;
      if (length > maxLength) {
        maxLength = length;
      }
    });
    column.width = Math.min(maxLength + 2, 50);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
function getUniqueFieldValues(data, field) {
  const uniqueValues = /* @__PURE__ */ new Set();
  for (const row of data) {
    if (row[field] !== null && row[field] !== void 0) {
      uniqueValues.add(String(row[field]));
    }
  }
  return Array.from(uniqueValues).sort();
}
function getAvailableFields(data) {
  if (data.length === 0) {
    return [];
  }
  const firstRow = data[0];
  const fields = Object.keys(firstRow).map((name) => {
    const value = firstRow[name];
    let type = "string";
    if (typeof value === "number") {
      type = "number";
    } else if (value instanceof Date) {
      type = "date";
    } else if (typeof value === "boolean") {
      type = "boolean";
    }
    return { name, type };
  });
  return fields;
}

exports.exportPivotData = exportPivotData;
exports.generateCSV = generateCSV;
exports.generateExcel = generateExcel;
exports.getAvailableFields = getAvailableFields;
exports.getUniqueFieldValues = getUniqueFieldValues;
//# sourceMappingURL=chunk-6M575PJF.js.map
//# sourceMappingURL=chunk-6M575PJF.js.map