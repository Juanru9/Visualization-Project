import React, { useEffect, useState } from 'react';
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
import { HomePage } from './components/HomePage';
import { ExtranjerosHipotecasJSON, SpainCommunitiesGeoJSON, SpainProvincesGeoJSON, ViviendasTuristicasComunidadesData, ViviendasTuristicasProvinciasData } from './types';
import { MapaViviendaTuristicaProvincia } from './components/MapaViviendaTuristicaProvincia';
import { json } from 'd3';
import { MapaViviendaTuristicaComunidades } from './components/MapaViviendaTuristicaComunidades';
import { ExtranjerosHipotecasGroupedChart } from './components/ExtranjerosHipotecasGroupedChart';
import { ExtranjerosHipotecasTimeSeriesChart } from './components/ExtranjerosHipotecasTimeSeriesChart';

const drawerWidth = 240;

const App: React.FC = () => {
  const [geoData, setGeoData] = useState<SpainProvincesGeoJSON | undefined>(undefined);
  const [geoDataComunity, setGeoDataComunity] = useState<SpainCommunitiesGeoJSON | undefined>(undefined);
  const [generalTourismData, setGeneralTourismData] = useState<{ ViviendasTuristicas: ViviendasTuristicasProvinciasData } | null>(null);
  const [generalTourismDataCom, setGeneralTourismDataCom] = useState<{ ViviendasTuristicas: ViviendasTuristicasComunidadesData } | null>(null);
  const [extranjerosHipotecas, setExtranjerosHipotecas] = useState<{ ExtranjerosHipotecas: ExtranjerosHipotecasJSON } | null>(null);

  useEffect(() => {
    // Cargar el GeoJSON provincias
    json<SpainProvincesGeoJSON>('/geojson/spain-provinces.geojson')
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading GeoJSON (Provinces):', error));
    // Cargar el GeoJSON comunidades
    json<SpainCommunitiesGeoJSON>('/geojson/spain-communities.geojson')
    .then(data => setGeoDataComunity(data))
    .catch(error => console.error('Error loading GeoJSON (CCAA):', error));

    // Cargar el JSON de Viviendas Turísticas para provincias
    fetch('/data/ViviendasTuristicasProvincias.json')
      .then(response => response.json())
      .then(data => setGeneralTourismData(data))
      .catch(error => console.error('Error fetching data (Provinces):', error));

    // Cargar el JSON de Viviendas Turísticas para provincias
    fetch('/data/ViviendasTuristicasComunidades.json')
      .then(response => response.json())
      .then(data => setGeneralTourismDataCom(data))
      .catch(error => console.error('Error fetching data (CCAA):', error));

    // Cargar el JSON de datos Extranjeros vs importe hipotecas
    fetch('/data/ExtranjerosHipotecas.json')
    .then(response => response.json())
    .then(data => setExtranjerosHipotecas(data))
    .catch(error => console.error('Error fetching data extranjeros vs hipotecas:', error));
  }, []);

  if (!geoData || !generalTourismData || !geoDataComunity || !generalTourismDataCom || !extranjerosHipotecas) {
    return <div>Cargando datos iniciales...</div>;
  }
    
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
            {/* Viviendas Turisticas provincias */}
            <ListItem disablePadding key="ViviendasTuristicasProvincias">
              <ListItemButton component={Link} to="/ViviendasTuristicasProvincias">
                <MapIcon sx={{ mr: 2 }} />
                <ListItemText primary="Viviendas turísticas (Provincias)" />
              </ListItemButton>
            </ListItem>
            {/* Viviendas Turisticas comunidad */}
            <ListItem disablePadding key="ViviendasTuristicasComunidad">
              <ListItemButton component={Link} to="/ViviendasTuristicasComunidad">
                <MapIcon sx={{ mr: 2 }} />
                <ListItemText primary="Viviendas turísticas (CCAA)" />
              </ListItemButton>
            </ListItem>
            {/* BarChart */}
            <ListItem disablePadding key="barchart">
              <ListItemButton component={Link} to="/GroupedBarChart">
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Turismo extranjero vs Hipotecas (Bar Chart)" />
              </ListItemButton>
            </ListItem>
            {/* Turismo extranjero vs Hipotecas */}
            <ListItem disablePadding key="barchart">
            <ListItemButton component={Link} to="/TimeSeriesChart">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="Turismo extranjero vs Hipotecas (Serie temporal)" />
            </ListItemButton>
          </ListItem>
            {/* PIB vs Precio de las hipotecas */}
            <ListItem disablePadding key="barchart">
            <ListItemButton component={Link} to="/PIBvsPrecioHipotecas">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="PIB vs Hipotecas" />
            </ListItemButton>
          </ListItem>
            {/* Precio de las hipotecas vs Tipo de interes */}
            <ListItem disablePadding key="barchart">
            <ListItemButton component={Link} to="/PrecioHipotecasVsTipoInteres">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="Hipotecas vs Tipos de interés" />
            </ListItemButton>
          </ListItem>

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
            <Route path="/ViviendasTuristicasProvincias" element={<MapaViviendaTuristicaProvincia geoData={geoData} rawData={generalTourismData.ViviendasTuristicas} />} />
            <Route path="/ViviendasTuristicasComunidad" element={<MapaViviendaTuristicaComunidades geoData={geoDataComunity} rawData={generalTourismDataCom.ViviendasTuristicas} />} />
            <Route path="/GroupedBarChart" element={<ExtranjerosHipotecasGroupedChart data={extranjerosHipotecas.ExtranjerosHipotecas} />} />
            <Route path="/TimeSeriesChart" element={<ExtranjerosHipotecasTimeSeriesChart data={extranjerosHipotecas.ExtranjerosHipotecas} />} />
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