import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, TextField, Button, Typography, Paper, Stack, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { executeSql, getQueryHistory, translateNlToSql } from '../service/QueryService';
import { Query } from "../types/Query";
import { useAuth } from '../context/AuthProvider';
import { authGuard } from "../util/AuthGuard";
import { FirestoreTimestampUtil } from "../util/FirestoreTimestampUtil";

type Props = {
    onError: (msg: string) => void;
    onSubmit: (query: Query) => void;
};

const QueryComponent: React.FC<Props> = ({ onError, onSubmit }) => {
    const { token, user } = useAuth();



    // Mode: 0 = Translator | 1 = SQL | 2 = History
    const [mode, setMode] = useState(0);
    const [history, setHistory] = useState<Query[]>([]);
    const [historyStale, setHistoryStale] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<Query>({
        id: null,
        nlQuery: '',
        sqlQuery: ''
    })

    useEffect(() => {
        const fetchHistory = async () => {

            try {
                const data = await authGuard(user, token, getQueryHistory);
                setHistory(data);
                setHistoryStale(false);
            } catch (err: any) {
                console.log(err)
                onError(err.message);
            }
        };

        if (mode === 2 && historyStale) {
            fetchHistory();
        }
    }, [mode]);

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: number | null) => {
        if (newMode !== null) setMode(newMode);
        onError('');
        setQuery({
            id: null,
            nlQuery: '',
            sqlQuery: '',
        });
    };

    const handleQuerySelected = (query: Query) => {
        setQuery(query);
        setMode(query.nlQuery ? 0 : 1);
    }

    const handleTranslate = async () => {
        if (!query.nlQuery) {
            onError('Please enter text to translate.');
            return;
        }


        setLoading(true);
        onError('');

        try {
            const data = await authGuard(user, token, translateNlToSql, query);
            setQuery(data)
        } catch (error: unknown) {
            setLoading(false);

            if (error instanceof Error) {
                onError(error.message);
            } else {
                onError('An error occured. Please try again.');
            }
        } finally {
            setLoading(false);
            setHistoryStale(true);
        }

    };

    const handleSubmit = async () => {
        const sql = query.sqlQuery.trim();

        // Remove trailing semicolon
        const cleanedSql = sql.endsWith(';') ? sql.slice(0, -1) : sql;

        const finalQuery: Query = {
            ...query,
            sqlQuery: cleanedSql
        }

        if (!cleanedSql) {
            onError('Please enter SQL before submitting.');
        } else {
            setLoading(true);
            onError('');
            onSubmit(finalQuery);
            setLoading(false);
            setHistoryStale(true);
        }
    };

    function firestoreTimestampToDate(ts?: { seconds: number; nanos: number }): Date | null {
        if (!ts) return null;
        return new Date(ts.seconds * 1000 + Math.floor(ts.nanos / 1_000_000));
    }

    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
            <Box display="flex" justifyContent="flex-end">
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={loading}
                >
                    <ToggleButton value={0}>NL → SQL</ToggleButton>
                    <ToggleButton value={1}>SQL</ToggleButton>
                    <ToggleButton value={2}>History</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            {mode === 0 && (
                <Stack spacing={2}>
                    <TextField
                        label="Natural Language"
                        multiline
                        rows={2}
                        fullWidth
                        value={query.nlQuery}
                        onChange={(e) => setQuery(prev => ({ ...prev, nlQuery: e.target.value }))}
                        disabled={loading}
                    />
                    <TextField
                        label="Generated SQL"
                        multiline
                        rows={4}
                        fullWidth
                        value={query.sqlQuery}
                        onChange={(e) => setQuery(prev => ({ ...prev, sqlQuery: e.target.value }))}
                        disabled={loading}
                    />
                    <Box display="flex" gap={2}>
                        <Button variant="contained" onClick={handleTranslate} disabled={loading}>
                            Translate
                        </Button>
                        <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
                            Send SQL
                        </Button>
                    </Box>
                </Stack>
            )}

            {mode === 1 && (
                <Stack spacing={2}>
                    <TextField
                        label="SQL Query"
                        multiline
                        rows={6}
                        fullWidth
                        value={query.sqlQuery}
                        onChange={(e) => setQuery(prev => ({ ...prev, sqlQuery: e.target.value }))}
                        disabled={loading}
                    />
                    <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
                        Send SQL
                    </Button>
                </Stack>
            )}

            {mode === 2 && (
                <Box
                    maxHeight={300}
                    overflow="auto"
                    mt={1}
                    pr={1}
                >
                    {history.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No queries submitted yet.
                        </Typography>
                    ) : (
                        history.map((query, idx) => (
                            <Paper
                                key={idx}
                                variant="outlined"
                                sx={{ mb: 2, p: 2 }}
                                onClick={() => handleQuerySelected(query)}
                            >
                                {query.nlQuery && (
                                    <>
                                        <Typography variant="subtitle2">Natural Language:</Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {query.nlQuery}
                                        </Typography>
                                    </>
                                )}
                                <Typography variant="subtitle2">SQL:</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {query.sqlQuery}
                                </Typography>
                                {query.timestamp && (
                                    <Typography variant="caption" color="text.secondary">
                                        {FirestoreTimestampUtil.formatTimestamp(query.timestamp)}
                                    </Typography>
                                )}

                            </Paper>
                        ))
                    )}
                </Box>
            )}

        </Paper>
    );
};


export default QueryComponent;