import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Paper, Stack, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { getQueryHistory, translateNlToSql } from '../service/QueryService';
import { Query } from "../types/Query";
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from "../util/AuthGuard";
import { FirestoreTimestampUtil } from "../util/FirestoreTimestampUtil";
import { formatLimitDisplay, isLimitReached } from '../util/LimitDisplayUtil';

type Props = {
    onError: (msg: string) => void;
    onSubmit: (query: Query) => void;
};

const QueryComponent: React.FC<Props> = ({ onError, onSubmit }) => {
    const { token, user } = useAuth();
    const { updateTierIfNotNull, tier } = useTier();



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
                const result = await authGuard(user, token, getQueryHistory);
                setHistory(result.queries);
                updateTierIfNotNull(result.tier);
                setHistoryStale(false);
            } catch (err: any) {
                console.log(err)
                onError(err.message);
            }
        };

        if (mode === 2 && historyStale) {
            fetchHistory();
        }
    }, [mode, updateTierIfNotNull]);

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

        // Check translation limit
        if (tier) {
            if (isLimitReached(tier.translationLimitUsage, tier.translationLimit)) {
                const limit = parseInt(tier.translationLimit);
                const limitText = limit === -1 ? '∞' : limit.toString();
                onError(`You have reached your translation limit of ${limitText} for your ${tier.name} tier.`);
                return;
            }
        }

        setLoading(true);
        onError('');

        try {
            const result = await authGuard(user, token, translateNlToSql, query);
            setQuery(result.query);
            updateTierIfNotNull(result.tier);
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
            // Check query limit
            if (tier) {
                if (isLimitReached(tier.queryLimitUsage, tier.queryLimit)) {
                    const limit = parseInt(tier.queryLimit);
                    const limitText = limit === -1 ? '∞' : limit.toString();
                    onError(`You have reached your query limit of ${limitText} for your ${tier.name} tier.`);
                    return;
                }
            }
            
            setLoading(true);
            onError('');
            onSubmit(finalQuery);
            setLoading(false);
            setHistoryStale(true);
        }
    };



    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                {tier ? (
                    <>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                            {tier.name} Tier - Query Usage
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">SQL Queries</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography 
                                        variant="body1" 
                                        fontWeight="bold"
                                        color={isLimitReached(tier.queryLimitUsage, tier.queryLimit) ? 'error.main' : 'text.primary'}
                                    >
                                        {formatLimitDisplay(tier.queryLimitUsage, tier.queryLimit)}
                                    </Typography>
                                    {isLimitReached(tier.queryLimitUsage, tier.queryLimit) && (
                                        <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 0.5 }}>
                                            LIMIT REACHED
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">NL → SQL Translations</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography 
                                        variant="body1" 
                                        fontWeight="bold"
                                        color={isLimitReached(tier.translationLimitUsage, tier.translationLimit) ? 'error.main' : 'text.primary'}
                                    >
                                        {formatLimitDisplay(tier.translationLimitUsage, tier.translationLimit)}
                                    </Typography>
                                    {isLimitReached(tier.translationLimitUsage, tier.translationLimit) && (
                                        <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 0.5 }}>
                                            LIMIT REACHED
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Loading tier information...
                    </Typography>
                )}
            </Box>

            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
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
                        <Button 
                            variant="contained" 
                            onClick={handleTranslate} 
                            disabled={loading || (tier ? isLimitReached(tier.translationLimitUsage, tier.translationLimit) : false)}
                        >
                            Translate
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={handleSubmit} 
                            disabled={loading || (tier ? isLimitReached(tier.queryLimitUsage, tier.queryLimit) : false)}
                        >
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
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleSubmit} 
                        disabled={loading || (tier ? isLimitReached(tier.queryLimitUsage, tier.queryLimit) : false)}
                    >
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