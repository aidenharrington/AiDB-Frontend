import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import { UserQueryData } from '../types/UserQueryData';
import { FirestoreTimestampUtil } from '../util/FirestoreTimestampUtil';
import { formatDate } from '../util/DateUtil';
import { ColumnType } from '../types/Project';

interface ColumnMetadata {
    name: string;
    type: ColumnType;
}

interface Props {
    data: UserQueryData | null;
    columnMetadata?: ColumnMetadata[];
}

const QueryResultsComponent: React.FC<Props> = ({ data, columnMetadata }) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return null;
    }

    const headers = Object.keys(data[0]);

    const formatCellValue = (value: any, columnName: string): string => {
        // Handle null/undefined
        if (value === null || value === undefined) {
            return '-';
        }

        // Check if this column is a DATE type
        const columnInfo = columnMetadata?.find(col => col.name === columnName);
        if (columnInfo?.type === 'DATE') {
            // For DATE columns, format epoch milliseconds as YYYY-MM-DD
            return formatDate(value);
        }

        // Handle objects that might be timestamps
        if (typeof value === 'object' && value !== null) {
            // Check if it's a Firestore timestamp-like object
            if ('seconds' in value || 'nanos' in value) {
                return FirestoreTimestampUtil.formatTimestamp(value);
            }
            
            // For other objects, try to stringify them nicely
            try {
                return JSON.stringify(value);
            } catch (error) {
                return String(value);
            }
        }

        // Default to string conversion
        return String(value);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.grey[50]
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Query Results
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {data.length} row{data.length !== 1 ? 's' : ''} returned
                </Typography>
            </Box>
            
            <TableContainer sx={{ 
                flex: 1,
                overflow: 'auto',
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0
                }
            }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map((header, i) => (
                                <TableCell 
                                    key={i}
                                    sx={{ 
                                        fontWeight: 600,
                                        backgroundColor: theme.palette.grey[100],
                                        borderBottom: `2px solid ${theme.palette.divider}`,
                                        fontSize: '0.875rem',
                                        py: 1.5,
                                        px: 2
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIdx) => (
                            <TableRow 
                                key={rowIdx}
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.selected,
                                    }
                                }}
                            >
                                {headers.map((header, cellIdx) => (
                                    <TableCell 
                                        key={cellIdx}
                                        sx={{ 
                                            fontSize: '0.875rem',
                                            py: 1,
                                            px: 2,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {formatCellValue(row[header], header)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default QueryResultsComponent;