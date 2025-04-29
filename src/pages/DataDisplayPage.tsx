import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { uploadCsv } from '../service/CsvService';


const DataDisplayPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tableData, setTableData] = useState<string[][]>([]);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (!selectedFile) return;
      try {
        const data = await uploadCsv(selectedFile);
        setTableData(data);
      } catch (error) {
        console.error('Error uploading CSV:', error);
      }
    };
  
    return (
      <div style={{ padding: '2rem' }}>
        <input
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          id="csv-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="csv-upload">
          <Button variant="contained" component="span">
            Select CSV File
          </Button>
        </label>
  
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile}
          style={{ marginLeft: '1rem' }}
        >
          Upload
        </Button>
  
        {tableData.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {tableData[0].map((header, index) => (
                    <TableCell key={index}><b>{header}</b></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    );
  };
  
  export default DataDisplayPage;