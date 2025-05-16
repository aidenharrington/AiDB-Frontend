import React, { useState } from "react";
import { Box, Tabs, Tab, TextField, Button, Typography, Paper, Stack, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';

const SqlTranslatorComponent = () => {
    // Mode: 0 = Translator | 1 = SQL | 2 = History
    const [mode, setMode] = useState(0);
    const [nlInput, setNlInput] = useState('');
    const [sqlInput, setSqlInput] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: number | null) => {
        if (newMode !== null) setMode(newMode);
    };

    const handleTranslate = () => {
        // Todo - resume
    };

    const handleSendSql = () => {
        // TODO
        // set history
        // reset NL and SQL input
    }

    return (
        <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
            <Box display="flex" justifyContent="flex-end">
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
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
                        value={nlInput}
                        onChange={(e) => setNlInput(e.target.value)}
                    />
                    <TextField
                        label="Generated SQL"
                        multiline
                        rows={4}
                        fullWidth
                        value={sqlInput}
                        onChange={(e) => setSqlInput(e.target.value)}
                    />
                    <Box display="flex" gap={2}>
                        <Button variant="contained" onClick={handleTranslate}>Translate</Button>
                        <Button variant="contained" color="success" onClick={handleSendSql}>Send SQL</Button>
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
                        value={sqlInput}
                        onChange={(e) => setSqlInput(e.target.value)}
                    />
                    <Button variant="contained" color="success" onClick={handleSendSql}>Send SQL</Button>
                </Stack>
            )}

            {mode === 2 && (
                <Box
                    maxHeight={300}
                    overflow="auto"
                    mt={1}
                    pr={1}
                >
                    {/* {history.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No queries submitted yet.
                        </Typography>
                    ) : (
                        history.map((entry, idx) => (
                            <Paper key={idx} variant="outlined" sx={{ mb: 2, p: 2 }}>
                                {entry.nl && (
                                    <>
                                        <Typography variant="subtitle2">Natural Language:</Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>{entry.nl}</Typography>
                                    </>
                                )}
                                <Typography variant="subtitle2">SQL:</Typography>
                                <Typography variant="body2">{entry.sql}</Typography>
                            </Paper>
                        ))
                    )} */}
                </Box>
            )}
        </Paper>
    );
};

export default SqlTranslatorComponent;