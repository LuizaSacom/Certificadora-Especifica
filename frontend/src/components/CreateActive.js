import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importando axios

function CreateActive() {
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [shares, setShares] = useState('');
    const [valuePerShare, setValuePerShare] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Para exibir erros

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const newActive = {
            type,
            title,
            shares: parseInt(shares),
            value_per_share: parseFloat(valuePerShare),
        };

        try {
            // Substitua a URL abaixo pela URL da sua API
            const response = await axios.post('http://localhost:3000/actives', newActive, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Supondo que você use um token JWT
                }
            });

            // Verificando se o ativo foi cadastrado com sucesso
            if (response.status === 201) {
                navigate('/'); // Redireciona para a página inicial
            }
        } catch (error) {
            console.error('Erro ao cadastrar ativo', error);
            setError('Erro ao cadastrar ativo. Tente novamente!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Cadastrar Novo Ativo</Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} {/* Exibe a mensagem de erro */}

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tipo de Ativo</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Tipo de Ativo"
                        required
                    >
                        <MenuItem value="FFI">FFI</MenuItem>
                        <MenuItem value="EFT">EFT</MenuItem>
                        <MenuItem value="ACTION">ACTION</MenuItem>
                        <MenuItem value="CRIPTO">CRIPTO</MenuItem>
                        <MenuItem value="FIXED_INCOME">FIXED_INCOME</MenuItem>
                        <MenuItem value="OTHER">OTHER</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Título"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Cotas"
                    fullWidth
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Valor por Cota"
                    fullWidth
                    type="number"
                    value={valuePerShare}
                    onChange={(e) => setValuePerShare(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    sx={{ width: '100%' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
                </Button>
            </form>
        </Box>
    );
}

export default CreateActive;
