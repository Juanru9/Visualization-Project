import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  CssBaseline, 
  Box, 
  Divider 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart } from './components/BarChart';
import { MapComponent } from './components/MapComponent';
import { HomePage } from './components/HomePage';
import { DataPoint } from './types';

const data: DataPoint[] = [
  { name: 'Enero', value: 40 },
  { name: 'Febrero', value: 55 },
  { name: 'Marzo', value: 30 },
  { name: 'Abril', value: 80 },
  { name: 'Mayo', value: 60 },
  { name: 'Junio', value: 90 },
];

const drawerWidth = 240;

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* AppBar superior */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1, 
            backgroundColor: '#1976d2'
          }}
        >
          <Toolbar>
            <DashboardIcon sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap component="div">
              Dashboard de Datos
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Menú lateral (Drawer) */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box' 
            },
          }}
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem disablePadding key="heatmap">
              <ListItemButton component={Link} to="/heatmap">
                <MapIcon sx={{ mr: 2 }} />
                <ListItemText primary="Mapa de Calor" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding key="barchart">
              <ListItemButton component={Link} to="/barchart">
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Gráfico de Barras" />
              </ListItemButton>
            </ListItem>
            {/* Puedes agregar más elementos de navegación aquí */}
          </List>
        </Drawer>
        {/* Área principal de contenido */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            backgroundColor: '#f5f5f5', 
            minHeight: '100vh' 
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/heatmap" element={<MapComponent />} />
            <Route path="/barchart" element={<BarChart data={data} />} />
            <Route 
              path="/" 
              element={ <HomePage />} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;