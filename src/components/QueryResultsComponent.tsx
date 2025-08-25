import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { UserQueryData } from '../types/UserQueryData';
import { FirestoreTimestampUtil } from '../util/FirestoreTimestampUtil';

interface Props {
    data: UserQueryData | null;
}

const QueryResultsComponent: React.FC<Props> = ({ data }) => {
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
        <div style={{ padding: '2rem' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header, i) => (
                                <TableCell key={i}><b>{header}</b></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {headers.map((header, cellIdx) => (
                                    <TableCell key={cellIdx}>
                                        {formatCellValue(row[header])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default QueryResultsComponent;