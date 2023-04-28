import React, { useState } from 'react';
import './App.css';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { saveAs } from 'file-saver';

const theme = createTheme();

function generateUniqueRandomNumbers(x: number): number[] {
  const uniqueNumbers: Set<number> = new Set();

  while (uniqueNumbers.size < x) {
    const randomNumber: number = Math.floor(Math.random() * x);
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}

function formatDateUTC(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('en-us', { month: 'long' });
  const year = date.getUTCFullYear();
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}|UTC${hour}-${minutes}-${seconds}`;
}

function exportToCSV(numbers: number[]) {
  const csvContent = numbers.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const currentDate = new Date();
  const formattedDate = formatDateUTC(currentDate);
  const fileName = `unique-random-numbers-${formattedDate}.csv`;
  saveAs(blob, fileName);
}

function copyResultsToClipboard(numbers: number[]) {
  const textToCopy = numbers.join('\n');
  navigator.clipboard.writeText(textToCopy).then(
    () => {
      alert('Results copied to clipboard');
    },
    (err) => {
      alert('Failed to copy results to clipboard');
    },
  );
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const x = parseInt(inputValue, 10);
    if (x && x > 0) {
      const uniqueRandomNumbers = generateUniqueRandomNumbers(x);
      setRandomNumbers(uniqueRandomNumbers);
    } else {
      alert("Please enter a positive integer value for 'x'.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Unique Random Number Generator
          </Typography>
          <Paper sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Number of unique random numbers"
                type="number"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                fullWidth
                required
              />
              <Box sx={{ marginTop: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Generate
                </Button>
              </Box>
            </form>
          </Paper>
          {randomNumbers.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6">Generated unique random numbers:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => exportToCSV(randomNumbers)}
                >
                  Export to CSV
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => copyResultsToClipboard(randomNumbers)}
                >
                  Copy Results
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {randomNumbers.map((number, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;