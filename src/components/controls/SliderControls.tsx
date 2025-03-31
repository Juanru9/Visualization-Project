import React from "react";
import { Box, Slider, Typography } from "@mui/material";

interface SliderControlsProps {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  yearRange?: [number, number];
}

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const SliderControls: React.FC<SliderControlsProps> = ({
  month,
  setMonth,
  year,
  setYear,
  yearRange,
}) => {
  const handleMonthChange = (event: Event, newValue: number | number[]) => {
    const monthNumber = typeof newValue === "number" ? newValue : newValue[0];
    setMonth(monthNumber.toString().padStart(2, "0"));
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    const yearNumber = typeof newValue === "number" ? newValue : newValue[0];
    setYear(yearNumber.toString());
  };

  const currentMonthIndex = parseInt(month, 10) - 1;
  const currentMonthName = monthNames[currentMonthIndex] || "N/A";

  return (
    <Box
      sx={{
        width: 300,
        p: 3,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        Seleccionar Fecha
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Mes: {currentMonthName}
      </Typography>
      <Slider
        value={parseInt(month, 10)}
        min={1}
        max={12}
        onChange={handleMonthChange}
        valueLabelDisplay="auto"
        marks
        sx={{ mb: 3 }}
      />
      <Typography variant="subtitle1" gutterBottom>
        Año: {year}
      </Typography>
      <Slider
        value={parseInt(year, 10)}
        min={yearRange ? yearRange[0] : 2020}
        max={yearRange ? yearRange[1] : 2024}
        onChange={handleYearChange}
        valueLabelDisplay="auto"
        marks
      />
    </Box>
  );
};