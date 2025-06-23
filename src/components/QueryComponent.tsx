import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, TextField, Button, Typography, Paper, Stack, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { executeSql, getQueryHistory, translateNlToSql } from '../service/QueryService';
import { Query } from "../types/Query";
import { useAuth } from '../context/AuthProvider';
import { authGuard } from "../util/AuthGuard";

type Props = {
    onError: (msg: string) => void;
    onSubmit: (sqlQuery: string) => void;
};

const QueryComponent: React.FC<Props> = ({ onError, onSubmit }) => {
    const { token, user } = useAuth();

    // Mode: 0 = Translator | 1 = SQL | 2 = History
    const [mode, setMode] = useState(0);
    const [nlQuery, setNlQuery] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [history, setHistory] = useState<Query[]>([]);
    const [historyStale, setHistoryStale] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

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
        setNlQuery('');
        setSqlQuery('');
    };

    const handleEntrySelected = (entry: Query) => {
        setNlQuery(entry.nlQuery);
        setSqlQuery(entry.sqlQuery);
        // TODO: set this to entries mode based off type/if nlquery is present
        setMode(0);
    }

    const handleTranslate = async () => {
        if (!nlQuery) {
            onError('Please enter text to translate.');
            return;
        }

        setLoading(true);
        onError('');

        try {
            const data = await authGuard(user, token, translateNlToSql, nlQuery);
            setSqlQuery(data);
        } catch (error: unknown) {
            setLoading(false);

            if (error instanceof Error) {
                onError(error.message);
            } else {
                onError('An error occured. Please try again.');
            }
        } finally {
            setLoading(false);
        }

    };

    const handleSubmit = async () => {
        const sql = sqlQuery.trim();

        // Remove trailing semicolon
        const cleanedSql = sql.endsWith(';') ? sql.slice(0, -1) : sql;

        if (!cleanedSql) {
            onError('Please enter SQL before submitting.');
        } else {
            setLoading(true);
            onError('');
            onSubmit(cleanedSql);
            setLoading(false);
            setHistoryStale(true);
        }
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
                        value={nlQuery}
                        onChange={(e) => setNlQuery(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        label="Generated SQL"
                        multiline
                        rows={4}
                        fullWidth
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
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
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
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
                        history.map((entry, idx) => (
                            <Paper
                                key={idx}
                                variant="outlined"
                                sx={{ mb: 2, p: 2 }}
                                onClick={() => handleEntrySelected(entry)}    
                            >
                                {entry.nlQuery && (
                                    <>
                                        <Typography variant="subtitle2">Natural Language:</Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {entry.nlQuery}
                                        </Typography>
                                    </>
                                )}
                                <Typography variant="subtitle2">SQL:</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {entry.sqlQuery}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            )}

        </Paper>
    );
};

export default QueryComponent;