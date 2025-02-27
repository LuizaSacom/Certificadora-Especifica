import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuário");
  const [loading, setLoading] = useState(false);
  const [actives, setActives] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState(null);
  const [newBalanceDate, setNewBalanceDate] = useState("");
  const [newBalanceAmount, setNewBalanceAmount] = useState("");
  const [selectedActive, setSelectedActive] = useState(null); // Para armazenar o ativo selecionado
  const [openHistoryModal, setOpenHistoryModal] = useState(false); // Para controlar o modal de histórico

  // Recupera o nome de usuário do localStorage ao carregar o componente
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Busca os ativos do usuário ao carregar o componente
  const fetchActives = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Recupera o token do localStorage
      if (!token) {
        setError("Token não encontrado. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3000/actives", {
        headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho
      });

      setActives(response.data);
      setTotalBalance(
        response.data.reduce((acc, active) => acc + active.balance, 0)
      );
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar os dados dos ativos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActives();
  }, []);

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  // Função para navegar para a tela de cadastro de ativos
  const handleCreateActive = () => {
    navigate("/create-active");
  };

  // Função para adicionar um histórico de saldo
  const handleAddBalanceHistory = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Recupera o token do localStorage

      if (!token) {
        setError("Token não encontrado. Por favor, faça login novamente.");
        return;
      }

      console.log("Token enviado:", token); // Log para depuração

      const response = await axios.post(
        `http://localhost:3000/actives/${id}/history`,
        {
          incomeDate: newBalanceDate,
          value: newBalanceAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho
        }
      );

      console.log("Resposta do backend:", response.data); // Log para depuração

      // const formatedActives = actives.map((ac) => {
      //   if (ac.id === id) {
      //     ac.history = [
      //       ...ac.history,
      //       {
      //         id: response._id,
      //         value: newBalanceAmount,
      //         variation: response.variation,
      //         incomeDate: newBalanceDate,
      //       },
      //     ];
      //   }

      //   return ac;
      // });

      // // Atualiza o estado local
      // setActives(formatedActives);
      await fetchActives();

      setNewBalanceDate("");
      setNewBalanceAmount("");
      setSelectedActive(null);
      setOpenHistoryModal(false);
    } catch (err) {
      setError("Erro ao registrar histórico de saldo.");
      console.error("Erro ao registrar histórico:", err); // Log detalhado do erro
    }
  };

  // Função para abrir o modal de histórico
  const handleOpenHistoryModal = (active) => {
    setSelectedActive(active);
    setOpenHistoryModal(true);
  };

  // Função para fechar o modal de histórico
  const handleCloseHistoryModal = () => {
    setOpenHistoryModal(false);
  };

  const generateChartData = (activeHistory) => {
    const labels = activeHistory.map((history) =>
      new Date(history.incomeDate).toLocaleDateString()
    );
    const data = activeHistory.map((history) => history.value);

    return {
      labels: labels,
      datasets: [
        {
          label: "Histórico de Valor do Ativo",
          data: data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  };

  const deleteActiveHistory = async (historyId, activeId) => {
    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    console.log("activeId", activeId);
    console.log("historyId", historyId);

    if (!token) {
      setError("Token não encontrado. Por favor, faça login novamente.");
      return;
    }
    if (!historyId || !activeId) {
      setError("Falha ao encontrar ativo.");
      return;
    }

    console.log("Token enviado:", token); // Log para depuração

    await axios.delete(
      `http://localhost:3000/actives/${activeId}/history/${historyId}`,
      {
        headers: { Authorization: `Bearer ${token}` }, // Envia o token no cabeçalho
      }
    );

    await fetchActives();
    setSelectedActive(null);
    setOpenHistoryModal(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        padding: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          backgroundColor: "#9762FF",
          padding: 3,
          borderRadius: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: "bold", flexGrow: 1 }}
        >
          Bem-vindo(a), {username || "Usuário"}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: "bold", mr: 2 }}
        >
          Saldo Total: R$ {totalBalance?.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            backgroundColor: "#FF5B5B",
            color: "white",
            "&:hover": { backgroundColor: "#FF4040" },
            padding: "8px 16px",
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
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": { backgroundColor: "#388E3C" },
            padding: "8px 16px",
            mx: 3,
          }}
        >
          Cadastrar Ativo
        </Button>
      </Box>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {/* Tabela de Ativos */}
      <TableContainer
        component={Paper}
        sx={{ flex: 1, borderRadius: 2, boxShadow: 2 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cotas</TableCell>
              <TableCell>Saldo</TableCell>
              <TableCell>Último valor de cota</TableCell>
              <TableCell>Histórico de Saldos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actives.map((active) => (
              <TableRow key={active.id}>
                <TableCell>{active.title}</TableCell>
                <TableCell>{active.type}</TableCell>
                <TableCell>{active.shares}</TableCell>
                <TableCell>{active.balance?.toFixed(2)}</TableCell>
                <TableCell>
                  {active?.history?.[
                    active?.history?.length - 1
                  ]?.value?.toFixed(2) ?? 0}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenHistoryModal(active)}>
                    Ver Histórico
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Histórico de Saldos */}
      <Dialog open={openHistoryModal} onClose={handleCloseHistoryModal}>
        <DialogTitle>Histórico de Saldos</DialogTitle>
        <DialogContent>
          {selectedActive && (
            <Box>
              <Typography variant="h6">{selectedActive.title}</Typography>
              <TextField
                label="Data"
                type="date"
                value={newBalanceDate}
                onChange={(e) => setNewBalanceDate(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Saldo"
                type="number"
                value={newBalanceAmount}
                onChange={(e) => setNewBalanceAmount(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Button
                onClick={() => handleAddBalanceHistory(selectedActive.id)}
                sx={{ mt: 2 }}
              >
                Adicionar Histórico
              </Button>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Histórico:</Typography>
                {selectedActive.history.map((entry, index) => {
                  return (
                    <Typography key={index}>
                      {new Date(entry.incomeDate).toLocaleDateString()} - R$
                      {entry.value?.toFixed(2)}
                      <DeleteIcon
                        onClick={() =>
                          deleteActiveHistory(entry.id, selectedActive.id)
                        }
                      />
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryModal}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Gráficos */}
      <Box sx={{ flex: 1, mt: 1 }}>
        {/* Gráficos */}
        <Grid container spacing={3}>
          {actives.map(
            (active) =>
              active.history.length > 0 && (
                <Grid id={active.id} item xs={12} sm={4} key={active._id}>
                  {/* Histórico de Linha */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Histórico de {active.title}
                    </Typography>
                    <Box sx={{ height: "400px", width: "100%" }}>
                      <Line
                        data={generateChartData(active.history)}
                        options={{ responsive: true }}
                        height={180}
                      />
                    </Box>
                  </Box>
                </Grid>
              )
          )}
          {actives.map(
            (active) =>
              active.history.length > 0 && (
                <Grid id={active.id} item xs={12} sm={4} key={active._id}>
                  {/* Histórico de Barra */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Histórico de {active.title}
                    </Typography>
                    <Box sx={{ height: "400px", width: "100%" }}>
                      <Bar
                        data={generateChartData(active.history)}
                        options={{ responsive: true }}
                        height={180}
                      />
                    </Box>
                  </Box>
                </Grid>
              )
          )}
          {actives.map(
            (active) =>
              active.history.length > 0 && (
                <Grid id={active.id} item xs={12} sm={4} key={active._id}>
                  {/* Histórico de Pizza */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      Histórico de {active.title}
                    </Typography>
                    <Box sx={{ height: "400px", width: "100%" }}>
                      <Pie
                        data={generateChartData(active.history)}
                        options={{ responsive: true }}
                        height={180}
                      />
                    </Box>
                  </Box>
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
