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

interface Props {
    data: UserQueryData | null;
}

const QueryResultsComponent: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }

    const headers = Object.keys(data[0]);

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
                        {data.slice(1).map((row, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {headers.map((header, cellIdx) => (
                                    <TableCell key={cellIdx}>
                                        {String(row[header])}
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