import React, { useState } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { uploadExcel } from '../service/ExcelService';
import { ExcelData } from '../types/ExcelData';
import QueryComponent from "../components/QueryComponent";
import QueryResultsComponent from '../components/QueryResultsComponent';
import { executeSql } from '../service/QueryService';
import { UserQueryData } from '../types/UserQueryData';
import { useAuth } from '../context/AuthProvider';
import { authGuard } from '../util/AuthGuard';
import { Query } from '../types/Query';


const DataDisplayPage: React.FC = () => {
  const { token, user } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [curTableIdx, setCurTableIdx] = useState(0);
  const [userQueryData, setUserQueryData] = useState<UserQueryData | null>(null);

  const hasTables = excelData && excelData.tables && excelData.tables.length > 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
      const data = await authGuard(user, token, uploadExcel, selectedFile);
      setSuccessMessage('File uploaded successfully!');
      setExcelData(data);
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
      const data = await authGuard(user, token, executeSql, query);
      setUserQueryData(data);
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
    <div style={{ padding: '2rem' }}>
      {hasTables && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2>{excelData.tables[curTableIdx].name}</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {excelData.tables[curTableIdx].columns.map((col, i) => (
                      <TableCell key={i}><b>{col.name}</b></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {excelData.tables[curTableIdx].rows.map((row, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx}>{String(cell)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <BottomNavigation
            value={curTableIdx}
            onChange={(event, newValue) => setCurTableIdx(newValue)}
            showLabels
            style={{
              marginBottom: '2rem',
              width: 'fit-content'
            }}
          >
            {excelData.tables.map((table, index) => (
              <BottomNavigationAction
                key={index}
                label={table.name}
                value={index}
                sx={{
                  border: '1px solid #ccc',
                  backgroundColor: curTableIdx === index ? '#1976d2' : 'white',
                  color: curTableIdx === index ? 'white' : 'black',
                  minWidth: '100px',
                  borderRadius: '4px',
                  mx: 0.5,
                  '&.Mui-selected': {
                    color: 'white !important',
                  },
                }}
              />
            ))}
          </BottomNavigation>
        </div>
      )}

      <QueryComponent onError={setErrorMessage} onSubmit={handleSqlSubmit} />
      <QueryResultsComponent data={userQueryData} />

      <input
        type="file"
        accept=".xlsx"
        style={{ display: 'none' }}
        id="excel-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="excel-upload">
        <Button variant="contained" component="span">
          Select Excel File
        </Button>
      </label>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        style={{ marginLeft: '1rem' }}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {selectedFile && (
        <Typography variant="body1" style={{ marginTop: '1rem' }}>
          Selected File: {selectedFile.name}
        </Typography>
      )}
    </div>
  );
};

export default DataDisplayPage;