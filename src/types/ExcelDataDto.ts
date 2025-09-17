export type ColumnTypeDto = 'TEXT' | 'NUMBER' | 'DATE';

export interface ColumnDto {
  name: string;
  type: ColumnTypeDto;
}

export interface TableDto {
  name: string;
  columns: ColumnDto[];
  rows: (string | number | Date | null)[][];
}

export interface ExcelDataDto {
  projectName: string;
  tables: TableDto[];
}
