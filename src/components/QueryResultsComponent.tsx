import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import { UserQueryData } from '../types/UserQueryData';
import { FirestoreTimestampUtil } from '../util/FirestoreTimestampUtil';

interface Props {
    data: UserQueryData | null;
}

const QueryResultsComponent: React.FC<Props> = ({ data }) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return null;
    }

    // Filter out 'id' column from headers
    const headers = Object.keys(data[0]).filter(header => header.toLowerCase() !== 'id');

    const formatCellValue = (value: any): string => {
        // Handle null/undefined
        if (value === null || value === undefined) {
            return '';
        }

        // Handle timestamp-like strings (ISO date strings)
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                    });
                }
            } catch (error) {
                // If parsing fails, return as string
            }
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
                                        {formatCellValue(row[header])}
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