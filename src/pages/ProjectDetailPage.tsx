import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  useTheme,
  Tabs,
  Tab,
  Collapse,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getProject, uploadExcel, deleteTable } from '../service/ProjectService';
import { Project, Table as ProjectTable } from '../types/Project';
import QueryComponent from "../components/QueryComponent";
import QueryResultsComponent from '../components/QueryResultsComponent';
import { executeSql, getQueryHistory } from '../service/QueryService';
import { UserQueryData } from '../types/UserQueryData';
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from '../util/AuthGuard';
import { Query } from '../types/Query';
import MainLayout from '../components/Layout/MainLayout';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import MessageDisplay from '../components/MessageDisplay';
import { formatDate } from '../util/DateUtil';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProjectDetailPage: React.FC = () => {
  const { token, user } = useAuth();
  const { updateTierIfNotNull, tier, fetchTierIfNeeded } = useTier();
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [translationSuccessMessage, setTranslationSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [userQueryData, setUserQueryData] = useState<UserQueryData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTableTab, setActiveTableTab] = useState(0);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQueryFromHistory, setSelectedQueryFromHistory] = useState<Query | null>(null);
  const [queryHistory, setQueryHistory] = useState<Query[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<ProjectTable | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasTables = project?.tables && project.tables.length > 0;

  // Callback to add queries to in-memory history
  // Note: This should only be called for new queries (without ID) to avoid duplicates
  // when the same query is translated and then executed
  const handleQueryHistoryUpdate = (query: Query) => {
    setQueryHistory(prevHistory => {
      // Check if query already exists to avoid duplicates
      const exists = prevHistory.some(existingQuery => 
        existingQuery.nlQuery === query.nlQuery && 
        existingQuery.sqlQuery === query.sqlQuery
      );
      
      if (!exists) {
        // Add timestamp if not present
        const queryWithTimestamp = {
          ...query,
          timestamp: query.timestamp || new Date().toISOString()
        };
        return [queryWithTimestamp, ...prevHistory];
      }
      
      return prevHistory;
    });
  };

  // Fetch tier info if needed when page loads
  useEffect(() => {
    if (token && !tier) {
      fetchTierIfNeeded(token);
    }
  }, [token, tier, fetchTierIfNeeded]);

  // Fetch initial query history when component loads
  useEffect(() => {
    const fetchInitialHistory = async () => {
      if (user && token && projectId && !historyLoading) {
        setHistoryLoading(true);
        try {
          const result = await authGuard(user, token, getQueryHistory, projectId);
          setQueryHistory(result.queries);
          updateTierIfNotNull(result.tier);
        } catch (error) {
          console.error('Error fetching initial query history:', error);
          // Don't show error to user for initial history fetch
        } finally {
          setHistoryLoading(false);
        }
      }
    };

    fetchInitialHistory();
  }, [user, token, projectId, updateTierIfNotNull]);

  useEffect(() => {
    const fetchProject = async () => {
        if (projectLoading) return; // Prevent duplicate calls
        
        setProjectLoading(true);
        try {
            setErrorMessage('');
            const result = await authGuard(user, token, getProject, projectId!);
            setProject(result.project);
            updateTierIfNotNull(result.tier);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProject(null);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
            setProjectLoading(false);
        }
    };

    if (user && token && !projectLoading) {
        fetchProject();
    }
}, [user, token, updateTierIfNotNull]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxFileSizeMB = tier?.maxFileSize ? parseInt(tier.maxFileSize) : 500; // Default to 500MB
      const fileSizeMB = file.size / (1024 * 1024);
      
      // Skip validation if maxFileSize is -1 (unlimited)
      if (maxFileSizeMB !== -1 && fileSizeMB > maxFileSizeMB) {
        setErrorMessage(`File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum allowed size of ${maxFileSizeMB}MB for your ${tier?.name || 'Free'} tier.`);
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const result = await authGuard(user, token, uploadExcel, projectId!, selectedFile);
      setSuccessMessage('File uploaded successfully!');
      
      // Concatenate new tables to existing project instead of replacing entire project
      if (project && result.project) {
        setProject({
          ...project,
          tables: [...result.project.tables, ...project.tables]
        });
      } else {
        setProject(result.project);
      }
      updateTierIfNotNull(result.tier);
      
      // Reset the selected file after successful upload
      setSelectedFile(null);
      
      // Reset the file input element
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An error occured. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationSuccess = () => {
    setTranslationSuccessMessage('Translation completed successfully!');
    // Clear the message after 3 seconds
    setTimeout(() => {
      setTranslationSuccessMessage('');
    }, 3000);
  };

  const handleSqlSubmit = async (query: Query) => {
    setLoading(true);
    setErrorMessage('');
    setTranslationSuccessMessage(''); // Clear translation message when submitting

    try {
      const result = await authGuard(user, token, executeSql, query);
      setUserQueryData(result.data);
      updateTierIfNotNull(result.tier);
      
      // Add successful execution to in-memory history only if it's a new query (no ID)
      if (!query.id) {
        handleQueryHistoryUpdate(query);
      }
      
      // Auto-switch to query results tab
      setActiveTab(1);
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An error occured. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySelected = (query: Query) => {
    // Close the history drawer when a query is selected
    setHistoryDrawerOpen(false);
    
    // Pass the selected query to the main component
    setSelectedQueryFromHistory(query);
    
    // Clear the selected query after a short delay to prevent re-processing
    setTimeout(() => {
      setSelectedQueryFromHistory(null);
    }, 100);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTableTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTableTab(newValue);
  };

  const handleDeleteTableClick = (table: ProjectTable, event: React.MouseEvent) => {
    event.stopPropagation();
    setTableToDelete(table);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTableConfirm = async () => {
    if (!tableToDelete || !project) return;
    
    setDeleting(true);
    try {
      const result = await authGuard(user, token, deleteTable, projectId!, tableToDelete.id);
      
      // Remove the table from local state
      setProject(prevProject => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          tables: prevProject.tables.filter(table => table.id !== tableToDelete.id)
        };
      });
      
      updateTierIfNotNull(result.tier);
      setDeleteDialogOpen(false);
      setTableToDelete(null);
      setSuccessMessage(`Table "${tableToDelete.displayName}" deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete table:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete table');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteTableCancel = () => {
    setDeleteDialogOpen(false);
    setTableToDelete(null);
  };

  const filteredTables = project?.tables?.filter(table => 
    table.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Reset active table tab when filtered tables change
  useEffect(() => {
    if (activeTableTab >= filteredTables.length && filteredTables.length > 0) {
      setActiveTableTab(0);
    }
  }, [filteredTables.length, activeTableTab]);

  // Reset scroll position when table tab changes
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      tableContainerRef.current.scrollLeft = 0;
    }
  }, [activeTableTab]);

  // Helper function to format cell values based on column type
  const formatCellValue = (cell: any, columnIndex: number, table: ProjectTable): string => {
    if (cell === null || cell === undefined) {
      return '-';
    }

    // Check if this column is a DATE type
    const column = table.columns?.[columnIndex];
    if (column?.type === 'DATE') {
      // For DATE columns, format epoch milliseconds as YYYY-MM-DD
      return formatDate(cell);
    }

    // For non-DATE columns, return as string
    return String(cell);
  };

  return (
    <MainLayout>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Project Name */}
        <Box sx={{ mb: 0.5, flexShrink: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {project?.name || 'Project'}
          </Typography>
        </Box>

        {/* Header with Main Tabs and Search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1,
          minHeight: 48,
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': { 
                  minHeight: 40,
                  textTransform: 'none',
                  fontWeight: 500
                }
              }}
            >
              <Tab label="Data Tables" />
              <Tab label="Query Results" />
            </Tabs>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeTab === 0 && (
              <TextField
                size="small"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
            )}
            <IconButton
              onClick={() => setHistoryDrawerOpen(!historyDrawerOpen)}
              sx={{ 
                bgcolor: historyDrawerOpen ? 'primary.main' : 'transparent',
                color: historyDrawerOpen ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: historyDrawerOpen ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Table Tabs (Sheet Names) - Below Main Tabs */}
        {hasTables && activeTab === 0 && (
          <Box sx={{ mb: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
            <Tabs 
              value={activeTableTab} 
              onChange={handleTableTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                minHeight: 36,
                ml: 0,
                '& .MuiTabs-scroller': {
                  marginLeft: 0,
                  paddingLeft: 0
                },
                '& .MuiTabs-flexContainer': {
                  paddingLeft: 0,
                  marginLeft: 0
                },
                '& .MuiTabs-scrollButtons': {
                  width: '40px',
                  '&.Mui-disabled': {
                    width: 0,
                    opacity: 0,
                    pointerEvents: 'none'
                  }
                },
                '& .MuiTab-root': { 
                  minHeight: 36,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  py: 0.5,
                  '&:first-of-type': {
                    marginLeft: 0,
                    paddingLeft: '16px'
                  }
                }
              }}
            >
              {filteredTables.map((table, index) => (
                <Tab key={index} label={table.displayName} />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Main Content Area - This is the flexible part that shrinks */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          overflow: 'hidden',
          minHeight: 0,
          maxHeight: 'calc(100vh - 64px - 48px - 380px)', // Constrain table area height
          '@media (max-height: 900px)': {
            maxHeight: 'calc(100vh - 64px - 48px - 350px)'
          },
          '@media (max-height: 768px)': {
            maxHeight: 'calc(100vh - 64px - 48px - 310px)'
          }
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0
          }}>
            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ 
                flex: 1,
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0
              }}>
                {hasTables && filteredTables.length > 0 ? (
                  (() => {
                    const table = filteredTables[activeTableTab];
                    return (
                      <Paper
                        elevation={2}
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          background: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          minHeight: 0
                        }}
                      >
                        {/* Table Header */}
                        <Box sx={{ 
                          p: 2, 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.grey[50],
                          flexShrink: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                              {table.displayName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {table.fileName} • {table.rows?.length || 0} rows • {table.columns?.length || 0} columns
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDeleteTableClick(table, e)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.contrastText'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Scrollable Table Container */}
                        <TableContainer 
                          ref={tableContainerRef}
                          sx={{ 
                            flex: 1,
                            minHeight: 0,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                              width: '12px',
                              height: '12px'
                            },
                            '&::-webkit-scrollbar-track': {
                              background: theme.palette.grey[100],
                              borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: theme.palette.grey[400],
                              borderRadius: '4px',
                              '&:hover': {
                                background: theme.palette.grey[600]
                              }
                            },
                            '& .MuiTable-root': {
                              borderCollapse: 'separate',
                              borderSpacing: 0
                            }
                          }}
                        >
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                {table.columns?.map((col, i) => (
                                  <TableCell 
                                    key={i} 
                                    sx={{ 
                                      fontWeight: 600,
                                      backgroundColor: theme.palette.grey[100],
                                      borderBottom: `2px solid ${theme.palette.divider}`,
                                      fontSize: '0.875rem',
                                      py: 1.5,
                                      px: 2,
                                      minWidth: 150,
                                      whiteSpace: 'nowrap',
                                      position: 'sticky',
                                      top: 0,
                                      zIndex: 1
                                    }}
                                  >
                                    {col.name}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {table.rows?.map((row, rowIndex) => (
                                <TableRow 
                                  key={rowIndex}
                                  sx={{
                                    '&:nth-of-type(odd)': {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                    '&:hover': {
                                      backgroundColor: theme.palette.action.selected,
                                    }
                                  }}
                                >
                                  {row.map((cell, cellIndex) => (
                                    <TableCell 
                                      key={cellIndex}
                                      sx={{ 
                                        fontSize: '0.875rem',
                                        py: 1,
                                        px: 2,
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        minWidth: 150,
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {formatCellValue(cell, cellIndex, table)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    );
                  })()
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {searchTerm ? 'No tables match your search' : 'No tables available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Try a different search term' : 'Upload an Excel file to view tables'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ 
                flex: 1,
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0
              }}>
                {userQueryData ? (
                  <Box sx={{ 
                    flex: 1,
                    overflow: 'auto',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    minHeight: 0
                  }}>
                    <QueryResultsComponent 
                      data={userQueryData} 
                      columnMetadata={project?.tables.flatMap(table => table.columns) || []}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No query results
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Execute a query to see results here
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </Box>

          {/* Query History Drawer */}
          <Collapse in={historyDrawerOpen} orientation="horizontal">
            <Box sx={{ 
              width: 380,
              height: '100%',
              borderLeft: `2px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.primary.light,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 8px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ 
                p: 2, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}>
                <Typography variant="h6" fontWeight="bold">
                  Query History
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => setHistoryDrawerOpen(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ 
                flex: 1, 
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
              }}>
                <QueryComponent 
                  projectId={projectId!} 
                  onError={setErrorMessage} 
                  onSubmit={handleSqlSubmit}
                  showHistoryOnly={true}
                  onQuerySelected={handleQuerySelected}
                  onQueryHistoryUpdate={handleQueryHistoryUpdate}
                  inMemoryHistory={queryHistory}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Query Component and File Upload Section - Flexible height */}
        <Box sx={{ 
          mt: 1.5,
          flexShrink: 0
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 2
          }}>
            {/* Query Component */}
            <Box sx={{ flex: 1 }}>
              <QueryComponent 
                projectId={projectId!} 
                onError={setErrorMessage} 
                onSubmit={handleSqlSubmit}
                showHistoryOnly={false}
                selectedQueryFromHistory={selectedQueryFromHistory}
                onQueryHistoryUpdate={handleQueryHistoryUpdate}
                inMemoryHistory={queryHistory}
                onTranslationSuccess={handleTranslationSuccess}
              />
            </Box>

            {/* File Upload Section */}
            <Box sx={{ 
              width: 260,
              p: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  Upload Excel File
                </Typography>
                <Tooltip 
                  title={
                    <Box>
                      <Box sx={{ 
                        p: 1.5,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>
                          Excel File Requirements
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="body2" component="div" sx={{ mb: 0.75, color: 'black', whiteSpace: 'nowrap' }}>
                          • Table headers must be in the first row
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ mb: 0.75, color: 'black', whiteSpace: 'nowrap' }}>
                          • Only one header row per sheet
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ color: 'black', whiteSpace: 'nowrap' }}>
                          • Each column needs at least one populated cell
                        </Typography>
                      </Box>
                    </Box>
                  }
                  arrow
                  placement="left"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'white',
                        border: `2px solid ${theme.palette.primary.main}`,
                        boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
                        p: 0,
                        maxWidth: 'none',
                        '& .MuiTooltip-arrow': {
                          color: 'white',
                          '&::before': {
                            border: `2px solid ${theme.palette.primary.main}`,
                          }
                        }
                      }
                    }
                  }}
                >
                  <IconButton 
                    size="small" 
                    sx={{ 
                      p: 0.5,
                      color: theme.palette.success.main,
                      '&:hover': {
                        backgroundColor: theme.palette.success.main,
                        color: 'white',
                      }
                    }}
                  >
                    <InfoIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  id="excel-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="excel-upload">
                  <Button variant="outlined" component="span" startIcon={<UploadIcon />} fullWidth size="small">
                    Choose File
                  </Button>
                </label>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  fullWidth
                  size="small"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
              </Box>

              {selectedFile && (
                <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}

              {tier && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Max size: {parseInt(tier.maxFileSize) === -1 ? '∞' : `${tier.maxFileSize}MB`}
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Messages - Dynamic height */}
          {(translationSuccessMessage || errorMessage || successMessage) && (
            <Box sx={{ mt: 0.5, py: 1, minHeight: 'auto' }}>
              {translationSuccessMessage && (
                <MessageDisplay 
                  message={translationSuccessMessage} 
                  type="success" 
                  maxWidth="100%"
                />
              )}

              {errorMessage && (
                <MessageDisplay 
                  message={errorMessage} 
                  type="error" 
                  maxWidth="600px"
                />
              )}
              
              {successMessage && (
                <MessageDisplay 
                  message={successMessage} 
                  type="success" 
                  maxWidth="600px"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Delete Table Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteTableCancel}
          onConfirm={handleDeleteTableConfirm}
          title="Delete Table"
          message="This will permanently delete the table and all its data. This action cannot be undone."
          itemName={tableToDelete?.displayName || ''}
          loading={deleting}
        />
      </Box>
    </MainLayout>
  );
};

export default ProjectDetailPage;