import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import { Query } from '../types/Query';
import { FirestoreTimestampUtil } from '../util/FirestoreTimestampUtil';

interface QueryHistoryProps {
  history: Query[];
  onQuerySelect: (query: Query) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({ history, onQuerySelect }) => {
  const theme = useTheme();

  if (history.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          No queries submitted yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden' // Prevent the container from overflowing
    }}>
      {/* Fixed Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          Query History
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Click to load a query
        </Typography>
      </Box>

      {/* Scrollable History List */}
      <Box sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        '&::-webkit-scrollbar': {
          width: '12px', // Make scrollbar wider and more visible
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '6px',
          border: '2px solid #f1f1f1',
          '&:hover': {
            background: '#555',
          },
        },
        '&::-webkit-scrollbar-corner': {
          background: '#f1f1f1',
        },
      }}>
        <Box sx={{ p: 2 }}>
          {history.map((query, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                mb: 2,
                p: 2,
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[2],
                },
                '&:last-child': {
                  mb: 0,
                },
              }}
              onClick={() => onQuerySelect(query)}
            >
              {/* Translation Section */}
              {query.nlQuery && (
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Translation
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 0.5,
                      lineHeight: 1.4,
                      color: theme.palette.text.primary
                    }}
                  >
                    {query.nlQuery}
                  </Typography>
                </Box>
              )}

              {/* SQL Section */}
              <Box sx={{ mb: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  SQL
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 0.5,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.grey[50],
                    p: 1,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  {query.sqlQuery}
                </Typography>
              </Box>

              {/* Timestamp */}
              {query.timestamp && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.7rem',
                    fontStyle: 'italic'
                  }}
                >
                  {FirestoreTimestampUtil.formatTimestamp(query.timestamp)}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default QueryHistory;
