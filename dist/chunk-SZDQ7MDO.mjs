import { z } from 'zod';

// src/lib/pivot/aggregations.ts
var sum = (values) => {
  if (!values || values.length === 0) return 0;
  return values.reduce((acc, val) => {
    const num = Number(val);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
};
var avg = (values) => {
  if (!values || values.length === 0) return 0;
  const total = sum(values);
  return (total ?? 0) / values.length;
};
var count = (values) => {
  if (!values) return 0;
  return values.filter((v) => v !== null && v !== void 0).length;
};
var min = (values) => {
  if (!values || values.length === 0) return null;
  const numbers = values.map(Number).filter((n) => !isNaN(n));
  if (numbers.length === 0) return null;
  return Math.min(...numbers);
};
var max = (values) => {
  if (!values || values.length === 0) return null;
  const numbers = values.map(Number).filter((n) => !isNaN(n));
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
};
var median = (values) => {
  if (!values || values.length === 0) return null;
  const numbers = values.map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);
  if (numbers.length === 0) return null;
  const mid = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    return (numbers[mid - 1] + numbers[mid]) / 2;
  }
  return numbers[mid];
};
var first = (values) => {
  if (!values || values.length === 0) return null;
  return values[0];
};
var last = (values) => {
  if (!values || values.length === 0) return null;
  return values[values.length - 1];
};
var aggregationFunctions = {
  sum,
  avg,
  count,
  min,
  max,
  median,
  first,
  last
};
function getAggregationFunction(name) {
  const fn = aggregationFunctions[name];
  if (!fn) {
    throw new Error(`Unknown aggregation function: ${name}`);
  }
  return fn;
}
function aggregate(values, field, aggregation) {
  const fieldValues = values.map((row) => row[field]);
  const fn = getAggregationFunction(aggregation);
  return fn(fieldValues);
}
function formatAggregationName(agg) {
  const names = {
    sum: "Sum",
    avg: "Average",
    count: "Count",
    min: "Minimum",
    max: "Maximum",
    median: "Median",
    first: "First",
    last: "Last"
  };
  return names[agg] || agg;
}

// src/lib/pivot/transformer.ts
function transformToPivot(rawData, config) {
  if (!rawData || rawData.length === 0) {
    return {
      data: [],
      metadata: {
        rowCount: 0,
        columnCount: 0,
        uniqueValues: {}
      },
      config
    };
  }
  if (config.rowFields.length === 0 && config.columnFields.length === 0) {
    return {
      data: rawData,
      metadata: {
        rowCount: rawData.length,
        columnCount: Object.keys(rawData[0] || {}).length,
        uniqueValues: {}
      },
      config
    };
  }
  const grouped = groupByFields(rawData, config.rowFields);
  const uniqueColumnValues = extractUniqueValues(rawData, config.columnFields);
  const pivotedData = generatePivotedRows(
    grouped,
    uniqueColumnValues,
    config
  );
  const withSubtotals = config.rowFields.length > 1 ? addHierarchicalSubtotals(pivotedData, rawData, config) : pivotedData;
  const withTotals = config.options.showRowTotals || config.options.showColumnTotals ? addTotals(withSubtotals, config, uniqueColumnValues) : withSubtotals;
  const finalData = config.options.showGrandTotal ? addGrandTotal(withTotals, config) : withTotals;
  return {
    data: finalData,
    metadata: {
      rowCount: finalData.length,
      columnCount: calculateColumnCount(uniqueColumnValues, config.valueFields),
      uniqueValues: Object.fromEntries(
        Object.entries(uniqueColumnValues).map(([k, v]) => [k, Array.from(v)])
      )
    },
    config
  };
}
function groupByFields(data, fields) {
  if (fields.length === 0) {
    return /* @__PURE__ */ new Map([["__all__", data]]);
  }
  const grouped = /* @__PURE__ */ new Map();
  for (const row of data) {
    const key = fields.map((field) => String(row[field] ?? "")).join("|");
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(row);
  }
  return grouped;
}
function extractUniqueValues(data, fields) {
  if (fields.length === 0) {
    return {};
  }
  const uniqueValues = {};
  for (const field of fields) {
    uniqueValues[field] = /* @__PURE__ */ new Set();
  }
  for (const row of data) {
    for (const field of fields) {
      const value = String(row[field] ?? "");
      uniqueValues[field].add(value);
    }
  }
  return uniqueValues;
}
function generateColumnCombinations(uniqueValues, fields) {
  if (fields.length === 0) {
    return [[]];
  }
  const [firstField, ...restFields] = fields;
  const firstValues = Array.from(uniqueValues[firstField] || []);
  if (restFields.length === 0) {
    return firstValues.map((v) => [v]);
  }
  const restCombinations = generateColumnCombinations(uniqueValues, restFields);
  const combinations = [];
  for (const value of firstValues) {
    for (const rest of restCombinations) {
      combinations.push([value, ...rest]);
    }
  }
  return combinations;
}
function generatePivotedRows(grouped, uniqueColumnValues, config) {
  const rows = [];
  const combinations = generateColumnCombinations(
    uniqueColumnValues,
    config.columnFields
  );
  for (const [groupKey, groupRows] of grouped.entries()) {
    const rowData = {
      __id: groupKey,
      __level: 0
    };
    const rowFieldValues = groupKey.split("|");
    config.rowFields.forEach((field, index) => {
      rowData[field] = rowFieldValues[index] || "";
    });
    if (config.columnFields.length === 0) {
      for (const valueField of config.valueFields) {
        const fieldKey = valueField.displayName || valueField.field;
        rowData[fieldKey] = aggregate(groupRows, valueField.field, valueField.aggregation);
      }
    } else {
      const columnIndex = /* @__PURE__ */ new Map();
      for (const row of groupRows) {
        const key = config.columnFields.map((field) => String(row[field] ?? "")).join("|");
        if (!columnIndex.has(key)) {
          columnIndex.set(key, []);
        }
        columnIndex.get(key).push(row);
      }
      for (const combination of combinations) {
        const lookupKey = combination.join("|");
        const matchingRows = columnIndex.get(lookupKey) || [];
        for (const valueField of config.valueFields) {
          const displayName = valueField.displayName || valueField.field;
          const columnKey = [...combination, displayName].join("__");
          rowData[columnKey] = matchingRows.length > 0 ? aggregate(matchingRows, valueField.field, valueField.aggregation) : void 0;
        }
      }
    }
    rows.push(rowData);
  }
  return rows;
}
function addHierarchicalSubtotals(data, rawData, config, uniqueColumnValues) {
  if (config.rowFields.length <= 1) {
    return data;
  }
  return buildHierarchicalRows(data, config, 0);
}
function buildHierarchicalRows(rows, config, level) {
  if (level >= config.rowFields.length - 1) {
    return rows.map((row) => ({ ...row, __level: level }));
  }
  const currentField = config.rowFields[level];
  const groupMap = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const key = String(row[currentField] ?? "");
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(row);
  }
  const parentRows = [];
  for (const [groupKey, groupRows] of groupMap.entries()) {
    const children = buildHierarchicalRows(groupRows, config, level + 1);
    const parentRow = {
      __id: `${currentField}_${groupKey}_level${level}`,
      __level: level,
      __groupKey: groupKey,
      __expanded: config.options.expandedByDefault ?? false
    };
    parentRow[currentField] = groupKey;
    aggregateParentValues(parentRow, groupRows, config);
    parentRow.subRows = children;
    parentRows.push(parentRow);
  }
  return parentRows;
}
function aggregateParentValues(parentRow, childRows, config) {
  if (config.columnFields.length === 0) {
    for (const valueField of config.valueFields) {
      const displayName = valueField.displayName || valueField.field;
      const values = childRows.map((row) => row[displayName]).filter((v) => v !== null && v !== void 0);
      if (valueField.aggregation === "sum") {
        parentRow[displayName] = values.reduce((sum2, val) => sum2 + Number(val || 0), 0);
      } else if (valueField.aggregation === "count") {
        parentRow[displayName] = values.length;
      } else if (valueField.aggregation === "avg") {
        const sum2 = values.reduce((sum3, val) => sum3 + Number(val || 0), 0);
        parentRow[displayName] = values.length > 0 ? sum2 / values.length : 0;
      } else if (valueField.aggregation === "min") {
        parentRow[displayName] = values.length > 0 ? Math.min(...values.map(Number)) : 0;
      } else if (valueField.aggregation === "max") {
        parentRow[displayName] = values.length > 0 ? Math.max(...values.map(Number)) : 0;
      } else if (valueField.aggregation === "first") {
        parentRow[displayName] = values[0];
      } else if (valueField.aggregation === "last") {
        parentRow[displayName] = values[values.length - 1];
      } else if (valueField.aggregation === "median") {
        const sorted = values.map(Number).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        parentRow[displayName] = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      }
    }
  } else {
    const firstRow = childRows[0];
    for (const key of Object.keys(firstRow)) {
      if (key.startsWith("__")) continue;
      if (config.rowFields.includes(key)) continue;
      const values = childRows.map((row) => row[key]).filter((v) => v !== null && v !== void 0 && !isNaN(Number(v)));
      if (values.length > 0) {
        parentRow[key] = values.reduce((sum2, val) => sum2 + Number(val), 0);
      }
    }
  }
}
function addTotals(data, config, uniqueColumnValues) {
  if (!config.options.showRowTotals && !config.options.showColumnTotals) {
    return data;
  }
  const withRowTotals = config.options.showRowTotals && config.columnFields.length > 0 ? addRowTotals(data, config, uniqueColumnValues) : data;
  const withColumnTotals = config.options.showColumnTotals ? addColumnTotals(withRowTotals, config) : withRowTotals;
  return withColumnTotals;
}
function addRowTotals(data, config, uniqueColumnValues) {
  if (config.columnFields.length === 0) {
    return data;
  }
  return data.map((row) => {
    const rowWithTotal = { ...row };
    const combinations = generateColumnCombinations(
      uniqueColumnValues,
      config.columnFields
    );
    for (const valueField of config.valueFields) {
      const values = [];
      const displayName = valueField.displayName || valueField.field;
      const totalKey = `__total_${displayName}`;
      for (const combination of combinations) {
        const columnKey = [...combination, displayName].join("__");
        if (rowWithTotal[columnKey] !== null && rowWithTotal[columnKey] !== void 0) {
          values.push(rowWithTotal[columnKey]);
        }
      }
      const aggregateFn = valueField.aggregation;
      if (aggregateFn === "count" || aggregateFn === "sum") {
        rowWithTotal[totalKey] = values.reduce((sum2, val) => sum2 + Number(val || 0), 0);
      } else if (aggregateFn === "avg") {
        const sum2 = values.reduce((sum3, val) => sum3 + Number(val || 0), 0);
        rowWithTotal[totalKey] = values.length > 0 ? sum2 / values.length : 0;
      } else if (aggregateFn === "min") {
        rowWithTotal[totalKey] = values.length > 0 ? Math.min(...values.map(Number)) : 0;
      } else if (aggregateFn === "max") {
        rowWithTotal[totalKey] = values.length > 0 ? Math.max(...values.map(Number)) : 0;
      } else if (aggregateFn === "first") {
        rowWithTotal[totalKey] = values.length > 0 ? values[0] : void 0;
      } else if (aggregateFn === "last") {
        rowWithTotal[totalKey] = values.length > 0 ? values[values.length - 1] : void 0;
      } else if (aggregateFn === "median") {
        if (values.length > 0) {
          const sorted = [...values].map(Number).sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          rowWithTotal[totalKey] = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
        } else {
          rowWithTotal[totalKey] = 0;
        }
      }
    }
    return rowWithTotal;
  });
}
function addColumnTotals(data, config, uniqueColumnValues) {
  if (config.columnFields.length === 0) {
    return data;
  }
  const columnTotalRow = {
    __id: "__column_total__",
    __isColumnTotal: true,
    __level: 0
  };
  if (config.rowFields.length > 0) {
    columnTotalRow[config.rowFields[0]] = "__COLUMN_TOTAL__";
  } else if (config.columnFields.length > 0) {
    columnTotalRow[config.columnFields[0]] = "__COLUMN_TOTAL__";
  }
  const firstRow = data[0];
  for (const key of Object.keys(firstRow)) {
    if (key.startsWith("__")) continue;
    if (config.rowFields.includes(key)) continue;
    const values = data.filter((row) => !row.__isGrandTotal && !row.__isColumnTotal && !row.__isSubtotal).map((row) => row[key]).filter((val) => val !== null && val !== void 0 && !isNaN(Number(val)));
    if (values.length > 0) {
      const total = values.reduce((sum2, val) => sum2 + Number(val), 0);
      columnTotalRow[key] = total;
    }
  }
  if (config.options.showRowTotals) {
    for (const valueField of config.valueFields) {
      const displayName = valueField.displayName || valueField.field;
      const totalKey = `__total_${displayName}`;
      const values = data.filter((row) => !row.__isGrandTotal && !row.__isColumnTotal && !row.__isSubtotal).map((row) => row[totalKey]).filter((val) => val !== null && val !== void 0 && !isNaN(Number(val)));
      if (values.length > 0) {
        columnTotalRow[totalKey] = values.reduce((sum2, val) => sum2 + Number(val), 0);
      }
    }
  }
  data.push(columnTotalRow);
  return data;
}
function addGrandTotal(data, config) {
  if (data.length === 0) return data;
  const grandTotal = {
    __id: "__grand_total__",
    __isGrandTotal: true,
    __level: 0
  };
  if (config.rowFields.length > 0) {
    grandTotal[config.rowFields[0]] = "__GRAND_TOTAL__";
  }
  const firstRow = data[0];
  for (const key of Object.keys(firstRow)) {
    if (key.startsWith("__")) continue;
    if (config.rowFields.includes(key)) continue;
    const values = data.filter((row) => !row.__isGrandTotal && !row.__isSubtotal).map((row) => row[key]).filter((val) => val !== null && val !== void 0 && !isNaN(Number(val)));
    if (values.length > 0) {
      grandTotal[key] = values.reduce((sum2, val) => sum2 + Number(val), 0);
    }
  }
  data.push(grandTotal);
  return data;
}
function calculateColumnCount(uniqueColumnValues, valueFields) {
  if (Object.keys(uniqueColumnValues).length === 0) {
    return valueFields.length;
  }
  let count2 = 1;
  for (const values of Object.values(uniqueColumnValues)) {
    count2 *= values.size;
  }
  return count2 * valueFields.length;
}
function generateColumnKey(columnValues, valueField) {
  return [...columnValues, valueField].join("__");
}
function parseColumnKey(key, columnFieldCount) {
  const parts = key.split("__");
  const columnValues = parts.slice(0, columnFieldCount);
  const valueField = parts.slice(columnFieldCount).join("__");
  return { columnValues, valueField };
}
var AggregationFunctionSchema = z.enum([
  "sum",
  "avg",
  "count",
  "min",
  "max",
  "median",
  "first",
  "last"
]);
var ValueFieldConfigSchema = z.object({
  field: z.string(),
  aggregation: AggregationFunctionSchema,
  displayName: z.string().optional()
});
var PivotConfigSchema = z.object({
  // Fields to group by (become row headers)
  rowFields: z.array(z.string()).default([]),
  // Fields to pivot (become column headers)
  columnFields: z.array(z.string()).default([]),
  // Fields to aggregate with their aggregation functions
  valueFields: z.array(ValueFieldConfigSchema).min(1, "At least one value field is required"),
  // Optional filter configuration
  filters: z.record(z.string(), z.any()).optional(),
  // Configuration options
  options: z.object({
    showRowTotals: z.boolean().default(true),
    showColumnTotals: z.boolean().default(true),
    showGrandTotal: z.boolean().default(true),
    expandedByDefault: z.boolean().default(false)
  }).default({
    showRowTotals: true,
    showColumnTotals: true,
    showGrandTotal: true,
    expandedByDefault: false
  })
});
var PivotMetadataSchema = z.object({
  rowCount: z.number(),
  columnCount: z.number(),
  uniqueValues: z.record(z.string(), z.array(z.string())),
  totalRows: z.number().optional()
});
var PivotResultSchema = z.object({
  data: z.array(z.record(z.string(), z.any())),
  metadata: PivotMetadataSchema,
  config: PivotConfigSchema
});
var ExportFormatSchema = z.enum(["csv", "excel", "json"]);
var ExportConfigSchema = z.object({
  format: ExportFormatSchema,
  includeTotals: z.boolean().default(true),
  filename: z.string().optional()
});

export { AggregationFunctionSchema, ExportConfigSchema, ExportFormatSchema, PivotConfigSchema, PivotMetadataSchema, PivotResultSchema, ValueFieldConfigSchema, aggregate, aggregationFunctions, avg, count, first, formatAggregationName, generateColumnKey, getAggregationFunction, last, max, median, min, parseColumnKey, sum, transformToPivot };
//# sourceMappingURL=chunk-SZDQ7MDO.mjs.map
//# sourceMappingURL=chunk-SZDQ7MDO.mjs.map