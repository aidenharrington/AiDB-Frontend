export type ColumnType = 'TEXT' | 'NUMBER' | 'DATE';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

export interface Table {
  id: string;
  fileName: string;
  displayName: string;
  tableName: string;
  columns: Column[];
  rows?: any[][];
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  tables: Table[];
}
