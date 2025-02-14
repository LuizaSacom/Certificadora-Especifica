import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Usuário');
  const [loading, setLoading] = useState(false);
  const [actives, setActives] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchActives = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/actives', {
          headers: {
            username: username,
          },
        });
        setActives(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os dados dos ativos.');
        setLoading(false);
      }
    };

    if (username) {
      fetchActives();
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/'); // Redireciona para a página de login
  };

  const handleCreateActive = () => {
    navigate('/create-active');
  };

  const generateBarChartData = () => {
    const labels = actives.map(active => active.title);
    const data = actives.map(active => active.balance);

    return {
      labels: labels,
      datasets: [{
        label: 'Saldo dos Ativos',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    };
  };

  const generatePieChartData = () => {
    const labels = actives.map(active => active.title);
    const data = actives.map(active => active.balance);

    return {
      labels: labels,
      datasets: [{
        label: 'Distribuição dos Ativos',
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverOffset: 4,
      }],
    };
  };

  const generateLineChartData = () => {
    const labels = actives.map(active => active.title);
    const data = actives.map(active => active.balance);

    return {
      labels: labels,
      datasets: [{
        label: 'Variação de Saldo dos Ativos',
        data: data,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      }],
    };
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ backgroundColor: '#9762FF', padding: 3, borderRadius: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1 }}>
          Bem-vindo(a), {username || 'Usuário'}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            backgroundColor: '#FF5B5B',
            color: 'white',
            '&:hover': { backgroundColor: '#FF4040' },
            padding: '8px 16px',
            fontSize: '16px',
          }}
          startIcon={<ExitToApp />}
        >
          Sair
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateActive}
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            '&:hover': { backgroundColor: '#388E3C' },
            padding: '8px 16px',
            fontSize: '16px',
            mx: 3
          }}
        >
          Cadastrar Ativo
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>{error}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ width: '48%', mb: 2 }}>
          {!loading && actives.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Tabela de Ativos
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2, boxShadow: 2, overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Cotas</TableCell>
                      <TableCell>Saldo</TableCell>
                      <TableCell>Valor por Cota</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actives.map((active) => (
                      <TableRow key={active._id}>
                        <TableCell>{active.title}</TableCell>
                        <TableCell>{active.type}</TableCell>
                        <TableCell>{active.shares}</TableCell>
                        <TableCell>{active.balance.toFixed(2)}</TableCell>
                        <TableCell>{active.value_per_share.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {!loading && actives.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gráfico de Pizza
              </Typography>
              <Pie data={generatePieChartData()} options={{ responsive: true }} height={180} />
            </>
          )}
        </Box>

        <Box sx={{ width: '48%', mb: 2 }}>
          {!loading && actives.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gráfico de Linhas
              </Typography>
              <Line data={generateLineChartData()} options={{ responsive: true }} height={180} />
            </>
          )}

          {!loading && actives.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gráfico de Colunas (Barras)
              </Typography>
              <Bar data={generateBarChartData()} options={{ responsive: true }} height={180} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
