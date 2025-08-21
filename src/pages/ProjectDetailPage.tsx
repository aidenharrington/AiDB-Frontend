import React, { useEffect, useState } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, useTheme } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getProject, uploadExcel } from '../service/ProjectService';
import { Project } from '../types/Project';
import QueryComponent from "../components/QueryComponent";
import QueryResultsComponent from '../components/QueryResultsComponent';
import { executeSql } from '../service/QueryService';
import { UserQueryData } from '../types/UserQueryData';
import { useAuth } from '../context/AuthProvider';
import { useTier } from '../context/TierProvider';
import { authGuard } from '../util/AuthGuard';
import { Query } from '../types/Query';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { isLimitReached } from '../util/LimitDisplayUtil';

const ProjectDetailPage: React.FC = () => {
  const { token, user } = useAuth();
  const { updateTierIfNotNull, tier, fetchTierIfNeeded } = useTier();
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userQueryData, setUserQueryData] = useState<UserQueryData | null>(null);

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
      
      setProject(result.project);
      updateTierIfNotNull(result.tier);
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
  }

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        {/* Tables Section - Always present to maintain layout */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Tables
          </Typography>
          
          {hasTables ? (
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 4,
                scrollSnapType: 'x mandatory',
                px: 2,
                minHeight: 400, // Maintain consistent height
              }}
            >
              {project.tables?.map((table, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    scrollSnapAlign: 'center',
                    flex: '0 0 auto',
                    width: 600, // Larger than projects page
                    minHeight: 400,
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: theme.palette.background.paper,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="h6" fontWeight="bold">
                        {table.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        File: {table.fileName}
                      </Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: 350, overflow: 'auto' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            {table.columns?.map((col, i) => (
                              <TableCell key={i} sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[100] }}>
                                {col.name}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {table.rows && table.rows.length > 0 ? (
                            table.rows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex}>
                                    {cell !== null && cell !== undefined ? String(cell) : ''}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={table.columns.length} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                  No data available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
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
                minHeight: 400,
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 4,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No tables available. Upload an Excel file to view tables.
              </Typography>
            </Box>
          )}
        </Box>



        {/* Query Components */}
        <Box sx={{ mb: 4 }}>
          <QueryComponent onError={setErrorMessage} onSubmit={handleSqlSubmit} />
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <QueryResultsComponent data={userQueryData} />
        </Box>

        {/* File Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Excel File
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="excel-upload">
              <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                Choose File
              </Button>
            </label>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>

          {selectedFile && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              Selected File: {selectedFile.name}
            </Typography>
          )}

          {tier && (
            <Typography variant="body2" color="text.secondary">
              Maximum file size: {parseInt(tier.maxFileSize) === -1 ? '∞' : `${tier.maxFileSize}MB`} • Accepts .xlsx files only
            </Typography>
          )}
        </Box>

        {errorMessage && (
          <Typography variant="body1" sx={{ color: 'error.main', mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        
        {successMessage && (
          <Typography variant="body1" sx={{ color: 'success.main', mb: 2 }}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;