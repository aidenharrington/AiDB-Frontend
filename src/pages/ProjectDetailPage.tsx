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
  InputAdornment
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getProject, uploadExcel, deleteTable } from '../service/ProjectService';
import { Project, Table as ProjectTable } from '../types/Project';
import QueryComponent from "../components/QueryComponent";
import QueryResultsComponent from '../components/QueryResultsComponent';
import { executeSql } from '../service/QueryService';
import { UserQueryData } from '../types/UserQueryData';
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from '../util/AuthGuard';
import { Query } from '../types/Query';
import { motion } from 'framer-motion';
import MainLayout from '../components/Layout/MainLayout';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import MessageDisplay from '../components/MessageDisplay';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
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

  // Add global styles for table scroll bars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .table-container::-webkit-scrollbar {
        height: 0px;
      }
      .table-container:hover::-webkit-scrollbar {
        height: 8px !important;
      }
      .table-container:hover::-webkit-scrollbar-track {
        background: #f5f5f5 !important;
        border-radius: 4px !important;
      }
      .table-container:hover::-webkit-scrollbar-thumb {
        background: #c1c1c1 !important;
        border-radius: 4px !important;
      }
      .table-container:hover::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userQueryData, setUserQueryData] = useState<UserQueryData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQueryFromHistory, setSelectedQueryFromHistory] = useState<Query | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<ProjectTable | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasTables = project?.tables && project.tables.length > 0;

  // Fetch tier info if needed when page loads
  useEffect(() => {
    if (token && !tier) {
      fetchTierIfNeeded(token);
    }
  }, [token, tier, fetchTierIfNeeded]);

  useEffect(() => {
    const fetchProject = async () => {
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
        }
    };

    if (user && token) {
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
          tables: [...project.tables, ...result.project.tables]
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

  const handleSqlSubmit = async (query: Query) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await authGuard(user, token, executeSql, query);
      setUserQueryData(result.data);
      updateTierIfNotNull(result.tier);
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

  return (
    <MainLayout>
      <Box sx={{ 
        height: 'calc(100vh - 64px - 48px)', // Full height minus navbar and padding
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header with Tabs and Search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          minHeight: 64
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 3 }}>
              {project?.name || 'Project'}
            </Typography>
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

        {/* Main Content Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          gap: 2,
          overflow: 'hidden'
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {hasTables ? (
                  <Box
                    sx={{
                      display: 'flex',
                      overflowX: 'auto',
                      gap: 3,
                      scrollSnapType: 'x mandatory',
                      px: 1,
                      flex: 1,
                      pb: 2
                    }}
                  >
                    {filteredTables.map((table, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                          scrollSnapAlign: 'start',
                          flex: '0 0 auto',
                          width: 500,
                          height: '100%',
                        }}
                        
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            height: '100%',
                            borderRadius: 2,
                            background: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
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
                                {table.fileName} • {table.rows?.length || 0} rows
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
                          <TableContainer 
                            className="table-container"
                            sx={{ 
                              flex: 1,
                              overflowX: 'auto',
                              '& .MuiTable-root': {
                                borderCollapse: 'separate',
                                borderSpacing: 0,
                                minWidth: '100%'
                              }
                            }}
                          >
                            <Table stickyHeader size="small" sx={{ minWidth: Math.max(500, (table.columns?.length || 0) * 120) }}>
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
                                        minWidth: 120,
                                        maxWidth: 250,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {col.name}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(() => {
                                  const maxRows = 20; // Fixed number of rows to display
                                  const actualRows = table.rows || [];
                                  const displayRows = actualRows.slice(0, maxRows);
                                  const emptyRows = Math.max(0, maxRows - actualRows.length);
                                  
                                  return (
                                    <>
                                      {displayRows.map((row, rowIndex) => (
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
                                                minWidth: 120,
                                                maxWidth: 250,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                              }}
                                            >
                                              {cell !== null && cell !== undefined ? String(cell) : ''}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                      {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
                                        <TableRow 
                                          key={`empty-${index}`}
                                          sx={{
                                            '&:nth-of-type(odd)': {
                                              backgroundColor: theme.palette.action.hover,
                                            }
                                          }}
                                        >
                                          {table.columns?.map((col, cellIndex) => (
                                            <TableCell 
                                              key={cellIndex}
                                              sx={{ 
                                                fontSize: '0.875rem',
                                                py: 1,
                                                px: 2,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                minWidth: 120,
                                                maxWidth: 250,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                              }}
                                            >
                                              &nbsp;
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </>
                                  );
                                })()}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No tables available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload an Excel file to view tables
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {userQueryData ? (
                  <Box sx={{ 
                    height: '100%', 
                    overflow: 'auto',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}>
                    <QueryResultsComponent data={userQueryData} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
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
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Query Component and File Upload Section */}
        <Box sx={{ 
          mt: 2,
          display: 'flex',
          gap: 2,
          height: 300,
          overflow: 'hidden'
        }}>
          {/* Query Component */}
          <Box sx={{ flex: 1 }}>
            <QueryComponent 
              projectId={projectId!} 
              onError={setErrorMessage} 
              onSubmit={handleSqlSubmit}
              showHistoryOnly={false}
              selectedQueryFromHistory={selectedQueryFromHistory}
            />
          </Box>

          {/* File Upload Section */}
          <Box sx={{ 
            width: 300,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Excel File
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <input
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                id="excel-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="excel-upload">
                <Button variant="outlined" component="span" startIcon={<UploadIcon />} fullWidth>
                  Choose File
                </Button>
              </label>

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                fullWidth
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </Box>

            {selectedFile && (
              <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-all' }}>
                Selected: {selectedFile.name}
              </Typography>
            )}

            {tier && (
              <Typography variant="caption" color="text.secondary">
                Max size: {parseInt(tier.maxFileSize) === -1 ? '∞' : `${tier.maxFileSize}MB`}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Error and Success Messages */}
        <MessageDisplay 
          message={errorMessage} 
          type="error" 
          maxWidth="600px"
        />
        
        <MessageDisplay 
          message={successMessage} 
          type="success" 
          maxWidth="600px"
        />

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