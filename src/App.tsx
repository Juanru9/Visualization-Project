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
  Divider, 
  IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import { HomePage } from './components/HomePage';
import { ExtranjerosHipotecasJSON, HipotecasRentaJSON, HipotecasTiposInteresJSON, PIBHipotecasJSON, SpainCommunitiesGeoJSON, SpainProvincesGeoJSON, ViviendasTuristicasComunidadesData, ViviendasTuristicasProvinciasData } from './types';
import { MapaViviendaTuristicaProvincia } from './components/MapaViviendaTuristicaProvincia';
import { json } from 'd3';
import { MapaViviendaTuristicaComunidades } from './components/MapaViviendaTuristicaComunidades';
import { ExtranjerosHipotecasGroupedChart } from './components/ExtranjerosHipotecasGroupedChart';
import { ExtranjerosHipotecasTimeSeriesChart } from './components/ExtranjerosHipotecasTimeSeriesChart';
import { DynamicLoader } from './components/loading/DynamicLoader';
import { PIBHipotecasTimeSeriesChart } from './components/PIBHipotecasTimeSeriesChart';
import { HipotecasTipoInteresTimeSeriesChart } from './components/HipotecasTipoInteresTimeSeriesChart';
import { HipotecasRentaDualAxisLineChart } from './components/HipotecasRentaDualAxisLineChart';

const drawerWidth = 240;

const App: React.FC = () => {
  // Estados para GeoJSON
  const [geoData, setGeoData] = useState<SpainProvincesGeoJSON | undefined>(undefined);
  const [geoDataComunity, setGeoDataComunity] = useState<SpainCommunitiesGeoJSON | undefined>(undefined);
  // Estados para datos JSON
  const [generalTourismData, setGeneralTourismData] = useState<{ ViviendasTuristicas: ViviendasTuristicasProvinciasData } | null>(null);
  const [generalTourismDataCom, setGeneralTourismDataCom] = useState<{ ViviendasTuristicas: ViviendasTuristicasComunidadesData } | null>(null);
  const [extranjerosHipotecas, setExtranjerosHipotecas] = useState<{ ExtranjerosHipotecas: ExtranjerosHipotecasJSON } | null>(null);
  const [pibHipotecas, setPibHipotecas] = useState<{ PIBHipotecas: PIBHipotecasJSON } | null>(null);
  const [interesHipotecas, setInteresHipotecas] = useState<{ HipotecasTiposInteres: HipotecasTiposInteresJSON } | null>(null);
  const [hipotecasRenta, setHipotecasRenta] = useState<{ HipotecasRenta: HipotecasRentaJSON } | null>(null);

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

    // Cargar el JSON de PIB nacional vs importe hipotecas por trimestre
    fetch('/data/PIBHipotecas.json')
    .then(response => response.json())
    .then(data => setPibHipotecas(data))
    .catch(error => console.error('Error fetching data PIB nacional vs importe hipotecas', error));

    // Cargar el JSON de Tipo de interés vs importe hipotecas por trimestre
    fetch('/data/HipotecasTiposInteres.json')
    .then(response => response.json())
    .then(data => setInteresHipotecas(data))
    .catch(error => console.error('Error fetching data PIB nacional vs importe hipotecas', error));

    // Cargar el JSON de Hipotecas vs Renta
    fetch('/data/HipotecasRenta.json')
    .then(response => response.json())
    .then(data => setHipotecasRenta(data))
    .catch(error => console.error('Error fetching data hipotecas vs renta', error));
  }, []);

  const isLoading = !geoData || !generalTourismData || !geoDataComunity || !generalTourismDataCom || !extranjerosHipotecas || !pibHipotecas || !interesHipotecas || !hipotecasRenta;
  if (isLoading) {
    return <DynamicLoader loading={true} message="Cargando datos..." />;
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
          <IconButton
            component={Link}
            to="/"
            edge="start"
            color="inherit"
            aria-label="dashboard"
            sx={{ mr: 2 }}
          >
            <DashboardIcon />
          </IconButton>
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
            <ListItem disablePadding key="TurismoExtranjerosVsHipotecasBar">
              <ListItemButton component={Link} to="/TurismoExtranjerosVsHipotecasBar">
                <BarChartIcon sx={{ mr: 2 }} />
                <ListItemText primary="Turismo extranjero vs Hipotecas (Bar Chart)" />
              </ListItemButton>
            </ListItem>
            {/* Turismo extranjero vs Hipotecas */}
            <ListItem disablePadding key="TurismoExtranjerosVsHipotecasLine">
            <ListItemButton component={Link} to="/TurismoExtranjerosVsHipotecasLine">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="Turismo extranjero vs Hipotecas (Serie temporal)" />
            </ListItemButton>
          </ListItem>
            {/* PIB vs número de las hipotecas */}
            <ListItem disablePadding key="PIBvsTotalHipotecas">
            <ListItemButton component={Link} to="/PIBvsTotalHipotecas">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="PIB vs nº Hipotecas (Serie temporal)" />
            </ListItemButton>
          </ListItem>
            {/* Numero de las hipotecas vs Tipo de interes */}
            <ListItem disablePadding key="PrecioHipotecasVsTipoInteres">
            <ListItemButton component={Link} to="/PrecioHipotecasVsTipoInteres">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="Hipotecas vs Tipos de interés (Serie temporal)" />
            </ListItemButton>
          </ListItem>
            {/* Hipotecas vs Renta media españoles */}
            <ListItem disablePadding key="HipotecaVsRenta">
            <ListItemButton component={Link} to="/HipotecaVsRenta">
              <BarChartIcon sx={{ mr: 2 }} />
              <ListItemText primary="Hipotecas vs Renta (Serie temporal)" />
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
            <Route path="/TurismoExtranjerosVsHipotecasBar" element={<ExtranjerosHipotecasGroupedChart data={extranjerosHipotecas.ExtranjerosHipotecas} />} />
            <Route path="/TurismoExtranjerosVsHipotecasLine" element={<ExtranjerosHipotecasTimeSeriesChart data={extranjerosHipotecas.ExtranjerosHipotecas} />} />
            <Route path="/PIBvsTotalHipotecas" element={<PIBHipotecasTimeSeriesChart data={pibHipotecas.PIBHipotecas} />} />
            <Route path="/PrecioHipotecasVsTipoInteres" element={<HipotecasTipoInteresTimeSeriesChart data={interesHipotecas.HipotecasTiposInteres} />} />
            <Route path="/HipotecaVsRenta" element={<HipotecasRentaDualAxisLineChart data={hipotecasRenta.HipotecasRenta} />} />
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