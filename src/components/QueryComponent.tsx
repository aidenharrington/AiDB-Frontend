import React, { useEffect, useState, useRef } from "react";
import { Box, TextField, Button, Typography, Paper, Stack, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { getQueryHistory, translateNlToSql } from '../service/QueryService';
import { Query } from "../types/Query";
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from "../util/AuthGuard";
import { FirestoreTimestampUtil } from "../util/FirestoreTimestampUtil";
import { formatLimitDisplay, isLimitReached, isDataLimitReached } from '../util/LimitDisplayUtil';
import QueryHistory from './QueryHistory';

type Props = {
    projectId: string;
    onError: (msg: string) => void;
    onSubmit: (query: Query) => void;
    showHistoryOnly?: boolean;
    onQuerySelected?: (query: Query) => void;
    selectedQueryFromHistory?: Query | null;
};

const QueryComponent: React.FC<Props> = ({ projectId, onError, onSubmit, showHistoryOnly = false, onQuerySelected, selectedQueryFromHistory }) => {
    const { token, user } = useAuth();
    const { updateTierIfNotNull, tier } = useTier();

    // Mode: 0 = Translator | 1 = SQL
    const [mode, setMode] = useState(showHistoryOnly ? 0 : 0);
    const [history, setHistory] = useState<Query[]>([]);
    const [historyStale, setHistoryStale] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<Query>({
        id: null,
        projectId: projectId,
        nlQuery: '',
        sqlQuery: ''
    });

    // New state variables for translation management
    const [hasTranslated, setHasTranslated] = useState<boolean>(false);
    const nlInputRef = useRef<string>('');


    // Handle natural language input changes
    const handleNlInputChange = (value: string) => {
        // If the input has changed from what was last translated, create a completely new query
        if (value !== nlInputRef.current) {
            setHasTranslated(false);
            setQuery({
                id: null,
                projectId: projectId,
                nlQuery: value,
                sqlQuery: '' // Clear SQL when NL input changes
            });
        } else {
            // Same input, just update the nlQuery
            setQuery(prev => ({
                ...prev,
                nlQuery: value
            }));
        }
    };

    // Handle SQL input changes
    const handleSqlInputChange = (value: string) => {
        setQuery(prev => ({
            ...prev,
            sqlQuery: value
        }));
        
        // If user manually changes SQL, mark as not translated
        if (hasTranslated) {
            setHasTranslated(false);
        }
    };

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

        if (showHistoryOnly && historyStale) {
            fetchHistory();
        }
    }, [showHistoryOnly, updateTierIfNotNull]);

    // Handle query selected from history
    useEffect(() => {
        if (selectedQueryFromHistory && !showHistoryOnly) {
            setQuery({
                ...selectedQueryFromHistory,
                projectId: projectId
            });
            
            // Switch to appropriate mode
            setMode(selectedQueryFromHistory.nlQuery ? 0 : 1);
            
            // Set translation state
            if (selectedQueryFromHistory.nlQuery && selectedQueryFromHistory.sqlQuery) {
                setHasTranslated(true);
                nlInputRef.current = selectedQueryFromHistory.nlQuery;
            } else {
                setHasTranslated(false);
                nlInputRef.current = selectedQueryFromHistory.nlQuery || '';
            }
        }
    }, [selectedQueryFromHistory, showHistoryOnly, projectId]);

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: number | null) => {
        if (newMode !== null) setMode(newMode);
        onError('');
        setQuery({
            id: null,
            projectId: projectId,
            nlQuery: '',
            sqlQuery: '',
        });
        // Reset translation state when changing modes
        setHasTranslated(false);
        nlInputRef.current = '';
    };

    const handleQuerySelected = (query: Query) => {
        // If in history-only mode, notify parent instead of handling locally
        if (showHistoryOnly && onQuerySelected) {
            onQuerySelected(query);
            return;
        }

        setQuery({
            ...query,
            projectId: projectId // Ensure projectId is set when selecting from history
        });
        setMode(query.nlQuery ? 0 : 1);
        
        // If the query has both NL and SQL content, treat it as already translated
        if (query.nlQuery && query.sqlQuery) {
            setHasTranslated(true);
            nlInputRef.current = query.nlQuery;
        } else {
            // Reset translation state for queries without SQL content
            setHasTranslated(false);
            nlInputRef.current = query.nlQuery || '';
        }
    }

    const handleTranslate = async () => {
        if (!query.nlQuery) {
            onError('Please enter text to translate.');
            return;
        }

        // Prevent duplicate translation for the same input
        if (hasTranslated && query.nlQuery === nlInputRef.current) {
            onError('This input has already been translated. Please modify the text to translate again.');
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
            
            // Mark as translated and store the current input
            setHasTranslated(true);
            nlInputRef.current = query.nlQuery;
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
            
            // Check data limit
            if (tier) {
                if (isDataLimitReached(tier.dataRowLimitUsage, tier.dataRowLimit)) {
                    const limit = parseInt(tier.dataRowLimit);
                    const limitText = limit === -1 ? '∞' : limit.toString();
                    onError(`You have reached your data row limit of ${limitText} for your ${tier.name} tier.`);
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



    // If showHistoryOnly is true, only show the history section
    if (showHistoryOnly) {
        return (
            <Box sx={{ height: '100%', width: '100%' }}>
                <QueryHistory 
                    history={history} 
                    onQuerySelect={handleQuerySelected}
                />
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Mode Toggle and Limits */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {tier && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">Tier:</Typography>
                            <Typography variant="caption" color="primary.main" fontWeight="medium">
                                {tier.name}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">Queries:</Typography>
                        <Typography 
                            variant="caption" 
                            fontWeight="bold"
                            color={tier && isLimitReached(tier.queryLimitUsage, tier.queryLimit) ? 'error.main' : 'text.primary'}
                        >
                            {tier ? formatLimitDisplay(tier.queryLimitUsage, tier.queryLimit) : '...'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">Translations:</Typography>
                        <Typography 
                            variant="caption" 
                            fontWeight="bold"
                            color={tier && isLimitReached(tier.translationLimitUsage, tier.translationLimit) ? 'error.main' : 'text.primary'}
                        >
                            {tier ? formatLimitDisplay(tier.translationLimitUsage, tier.translationLimit) : '...'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">Data Used:</Typography>
                        <Typography 
                            variant="caption" 
                            fontWeight="bold"
                            color={tier && isDataLimitReached(tier.dataRowLimitUsage, tier.dataRowLimit) ? 'error.main' : 'text.primary'}
                        >
                            {tier && parseInt(tier.dataRowLimit) === -1 ? '∞' : 
                             tier ? `${Math.round((parseInt(tier.dataRowLimitUsage) / parseInt(tier.dataRowLimit)) * 100)}%` : '...'}
                        </Typography>
                    </Box>
                </Box>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    disabled={loading}
                >
                    <ToggleButton value={0}>Translate</ToggleButton>
                    <ToggleButton value={1}>SQL</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Content Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', pt: 2 }}>
                {mode === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                        <Box sx={{ minHeight: 60 }}>
                            <TextField
                                label="Natural Language"
                                multiline
                                rows={2}
                                fullWidth
                                value={query.nlQuery}
                                onChange={(e) => handleNlInputChange(e.target.value)}
                                disabled={loading}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 80 }}>
                            <TextField
                                label="Generated SQL"
                                multiline
                                fullWidth
                                value={query.sqlQuery}
                                onChange={(e) => handleSqlInputChange(e.target.value)}
                                disabled={loading}
                                size="small"
                                sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%' } }}
                            />
                            {hasTranslated && query.sqlQuery && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        display: 'block', 
                                        mt: 0.5, 
                                        color: 'success.main',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    ✓ Translation completed
                                </Typography>
                            )}
                        </Box>
                        <Box display="flex" gap={1} sx={{ mt: 1 }}>
                            <Button 
                                variant="contained" 
                                size="small"
                                onClick={handleTranslate} 
                                disabled={loading || 
                                    (tier ? (isLimitReached(tier.translationLimitUsage, tier.translationLimit) || isDataLimitReached(tier.dataRowLimitUsage, tier.dataRowLimit)) : false) ||
                                    hasTranslated ||
                                    !query.nlQuery.trim()
                                }
                            >
                                {hasTranslated ? 'Already Translated' : 'Translate'}
                            </Button>
                            {hasTranslated && (
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => {
                                        setHasTranslated(false);
                                        setQuery(prev => ({ ...prev, sqlQuery: '' }));
                                        nlInputRef.current = '';
                                    }}
                                    disabled={loading}
                                >
                                    Reset
                                </Button>
                            )}
                            <Button 
                                variant="contained" 
                                color="success" 
                                size="small"
                                onClick={handleSubmit} 
                                disabled={loading || (tier ? (isLimitReached(tier.queryLimitUsage, tier.queryLimit) || isDataLimitReached(tier.dataRowLimitUsage, tier.dataRowLimit)) : false)}
                            >
                                Execute
                            </Button>
                        </Box>
                    </Box>
                )}

                {mode === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 150 }}>
                            <TextField
                                label="SQL Query"
                                multiline
                                fullWidth
                                value={query.sqlQuery}
                                onChange={(e) => handleSqlInputChange(e.target.value)}
                                disabled={loading}
                                size="small"
                                sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%' } }}
                            />
                        </Box>
                        <Box display="flex" gap={1} sx={{ mt: 1 }}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                size="small"
                                onClick={handleSubmit} 
                                disabled={loading || (tier ? (isLimitReached(tier.queryLimitUsage, tier.queryLimit) || isDataLimitReached(tier.dataRowLimitUsage, tier.dataRowLimit)) : false)}
                            >
                                Execute
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};


export default QueryComponent;