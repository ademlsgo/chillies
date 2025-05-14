import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PeopleIcon from '@mui/icons-material/People';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Fév', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Avr', sales: 2780 },
  { name: 'Mai', sales: 1890 },
  { name: 'Juin', sales: 2390 },
];

const stats = [
  { title: 'Ventes totales', value: '€15,350' },
  { title: 'Commandes', value: '125' },
  { title: 'Clients', value: '45' },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography component="p" variant="h4">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Ventes mensuelles
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{
                  top: 16,
                  right: 16,
                  bottom: 0,
                  left: 24,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
