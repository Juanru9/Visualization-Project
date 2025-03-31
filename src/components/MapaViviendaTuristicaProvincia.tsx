import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { ChoroplethMap } from "./ChoroplethMap";
import { SliderControls } from "./controls/SliderControls";
import {
  TourismDataPoint,
  SpainProvincesGeoJSON,
  ViviendasTuristicasProvinciasData,
} from "../types";
import { DynamicLoader } from "./loading/DynamicLoader";

interface MapaViviendaTuristicaProvinciaProps {
  geoData: SpainProvincesGeoJSON;
  rawData: ViviendasTuristicasProvinciasData;
}

export const MapaViviendaTuristicaProvincia: React.FC<MapaViviendaTuristicaProvinciaProps> = ({
  geoData,
  rawData,
}) => {
  const [month, setMonth] = useState("08");
  const [year, setYear] = useState("2020");
  const [data, setData] = useState<TourismDataPoint[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{ name: string; total: number } | null>(null);

  useEffect(() => {
    // Filtrar viviendasData según el mes y año seleccionados
    const filtered = rawData.filter(d => d.Mes === month && d.Anio === year);

    // Se asume que "Provincias" está en formato "04 Almería", por lo que extraemos el código y nombre
    const dataPoints: TourismDataPoint[] = filtered?.map((d) => {
      const parts = d.Provincias?.split(" ");
      const code = parts ? parts[0] : "00"; // Código de la provincia
      const name = parts?.slice(1).join(" ");
      return { code: code, name: name, value: d?.Total };
    }) ?? [];

    if (dataPoints.length === 0) {
      return;
    }

    setData(dataPoints);
  }, [month, year, rawData]);

  if (data.length === 0) {
    return <DynamicLoader loading={data.length === 0} message="Cargando datos..." />;
  }

  const totalViviendas = data.reduce((acc, dp) => acc + dp.value, 0);

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      {/* Título global */}
      <Typography variant="h4" align="center" gutterBottom>
        Número de viviendas turísticas: <b>{totalViviendas}</b>
      </Typography>
      <Grid container spacing={2} sx={{ height: "calc(100% - 80px)" }}>
        {/* Mapa: en xs ocupa 12 columnas, en md 8 */}
        <Grid sx={{ height: "90%" }}>
          <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
            <ChoroplethMap
              mode="province"
              geoData={geoData}
              data={data}
              onRegionClick={setSelectedProvince}
            />
          </Paper>
        </Grid>
        {/* Panel de controles: en xs ocupa 12 columnas, en md 4 */}
        <Grid sx={{ height: "90%" }}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedProvince ? (
              <Typography variant="h6" align="center" gutterBottom>
                {selectedProvince.name} – Total: {selectedProvince.total}
              </Typography>
            ) : (
              <Typography variant="h6" align="center" gutterBottom>
                Haz click en una provincia
              </Typography>
            )}
            <SliderControls month={month} setMonth={setMonth} year={year} setYear={setYear} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
