import React, { useState } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { uploadExcel } from '../service/ExcelService';
import { ExcelDataDto } from '../types/ExcelDataDto';


const DataDisplayPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelDataDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
      const data = await uploadExcel(selectedFile);
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

  return (
    <div style={{ padding: '2rem' }}>
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

      {excelData && (
        <div style={{ marginTop: '2rem' }}>
          <h2>{excelData.projectName}</h2>

          {excelData.tables.map((table, tableIndex) => (
            <div key={tableIndex} style={{ marginTop: '2rem' }}>
              <h3>{table.name}</h3>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {table.columns.map((col, i) => (
                        <TableCell key={i}><b>{col.name}</b></TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {table.rows.map((row, rowIdx) => (
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
          ))}
        </div>
      )}

    </div>
  );
};

export default DataDisplayPage;