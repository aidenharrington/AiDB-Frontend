export type ColumnType = 'TEXT' | 'NUMBER' | 'DATE';

export interface Column {
  name: string;
  type: ColumnType;
}

export interface Table {
  name: string;
  columns: Column[];
  rows: (string | number | Date | null)[][];
}

export interface ExcelData {
  projectName: string;
  tables: Table[];
}
