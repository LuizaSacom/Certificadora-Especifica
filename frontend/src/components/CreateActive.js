import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CreateActive() {
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [shares, setShares] = useState('');
    const [valuePerShare, setValuePerShare] = useState('');
    const [loading, setLoading] = useState(false);

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
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error('Erro ao cadastrar ativo', error);
        }
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Cadastrar Novo Ativo</Typography>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tipo de Ativo</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Tipo de Ativo"
                        required
                    >
                        {Object.values().map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
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