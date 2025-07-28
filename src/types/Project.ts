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

export interface Project {
  id: string;
  name: string;
  tables: Table[];
}
