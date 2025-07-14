import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Grid,
  Stack,
} from '@mui/material';
import { parseLambda, betaReduce, drawDiagram } from './Lambda';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      color: '#90caf9',
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
});

function App() {
  const [expression, setExpression] = useState('');
  const [currentTerm, setCurrentTerm] = useState(null);
  const [diagram, setDiagram] = useState(null);

  const handleInputChange = (e) => {
    setExpression(e.target.value);
  };

  const generateDiagram = () => {
    if (!expression) return;
    try {
      const term = parseLambda(expression);
      setCurrentTerm(term);
      setDiagram(drawDiagram(term));
    } catch (e) {
      alert(`Invalid lambda expression: ${e.message}`);
      setCurrentTerm(null);
      setDiagram(null);
    }
  };

  const performBetaReduction = () => {
    if (currentTerm) {
      try {
        const reduced = betaReduce(currentTerm);
        if (reduced === currentTerm) {
          alert('No further beta-reductions possible.');
          return;
        }
        setCurrentTerm(reduced);
        setDiagram(drawDiagram(reduced));
      } catch (e) {
        alert(`Error during beta reduction: ${e.message}`);
      }
    } else {
      alert('Please generate a diagram first.');
    }
  };

  const insertSymbol = (symbol) => {
    setExpression((prev) => prev + symbol);
  };

  const insertExample = () => {
    setExpression('((λx.(λw.xw))(λa.(λf.f)))');
  };

  // Generate a random lambda expression (simple, for demo)
  const randomLambdaExpression = () => {
    const vars = ['x', 'y', 'z', 'f', 'a', 'b'];
    const randVar = () => vars[Math.floor(Math.random() * vars.length)];
    const randLam = () => `λ${randVar()}.${randVar()}`;
    const randApp = () => `(${randLam()} ${randLam()})`;
    // Randomly choose between abstraction, application, or nested
    const options = [randLam, randApp, () => `(${randApp()} ${randLam()})`];
    setExpression(options[Math.floor(Math.random() * options.length)]());
  };

  const symbolButtons = [
    { display: 'λ', insert: 'λ' },
    { display: '(', insert: '(' },
    { display: ')', insert: ')' },
    { display: '.', insert: '.' },
    { display: 'x', insert: 'x' },
    { display: 'y', insert: 'y' },
    { display: 'z', insert: 'z' },
    { display: 'f', insert: 'f' },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          λ Lambda Diagram Generator
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Enter Lambda Expression"
                variant="filled"
                value={expression}
                onChange={handleInputChange}
                InputProps={{
                  style: { fontFamily: '"Roboto Mono", monospace' },
                }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {symbolButtons.map((btn) => (
                  <Button
                    key={btn.insert}
                    variant="outlined"
                    size="small"
                    onClick={() => insertSymbol(btn.insert)}
                  >
                    {btn.display}
                  </Button>
                ))}
                <Button variant="outlined" size="small" color="secondary" onClick={insertExample}>
                  Example
                </Button>
                <Button variant="outlined" size="small" color="primary" onClick={randomLambdaExpression}>
                  Random Lambda
                </Button>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateDiagram}
                  size="large"
                  fullWidth
                >
                  Generate Diagram
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={performBetaReduction}
                  size="large"
                  fullWidth
                >
                  Beta Reduction
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              <Paper elevation={6} sx={{ p: 2.5 }}>
                <Typography variant="h6" gutterBottom>
                  Current Term
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, mt: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '1rem',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentTerm ? currentTerm.toString() : 'No term generated.'}
                  </Typography>
                </Paper>
              </Paper>
              <Paper elevation={6} sx={{ p: 2.5, overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom>
                  Diagram
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    minHeight: 400,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                    p: 1,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 1
                  }}
                >
                  {diagram ? (
                    diagram
                  ) : (
                    <Typography color="text.secondary">
                      Diagram will appear here
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
