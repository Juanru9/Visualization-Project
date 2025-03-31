import React from "react";
import { geoMercator, geoPath } from "d3-geo";
import { interpolateReds, max, scaleSequential } from "d3";
import {
  SpainProvincesGeoJSON,
  SpainCommunitiesGeoJSON,
  TourismDataPoint,
  SpainProvinceProperties,
  SpainCommunitiesProperties,
} from "../types";

interface ChoroplethMapProps {
  mode: "province" | "community";
  // Se acepta geoData de cualquiera de los dos tipos
  geoData: SpainProvincesGeoJSON | SpainCommunitiesGeoJSON;
  // Los datos siempre deben incluir una propiedad "code" que se emparejará
  data: TourismDataPoint[];
  onRegionClick?: (region: { name: string; total: number } | null) => void;
}

export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  mode,
  geoData,
  data,
  onRegionClick,
}) => {
  // Dimensiones de referencia para el viewBox
  const width = 800;
  const height = 600;

  // Configurar proyección y path usando dimensiones de referencia
  const projection = geoMercator()
    .fitSize([width, height], geoData)
    .center([-3.9, 38.65])
    .scale(2400)
    .translate([width / 2, height / 2]);
  const pathGenerator = geoPath().projection(projection);

  const maxValue = max(data, (d) => d.value) || 0;
  const colorScale = scaleSequential(interpolateReds).domain([0, maxValue]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
      {geoData.features.map((feature, i) => {
        // Según el modo, casteamos las propiedades con la estructura esperada
        let codeValue: string;
        let nameValue: string;
        if (mode === "province") {
          codeValue = (feature.properties as SpainProvinceProperties).cod_prov;
          nameValue = (feature.properties as SpainProvinceProperties).name;
        } else {
          codeValue = (feature.properties as SpainCommunitiesProperties).cod_ccaa;
          nameValue = (feature.properties as SpainCommunitiesProperties).noml_ccaa;
        }

        // Ajuste para Canarias (se usa siempre cod_ccaa)
        const transform = feature.properties.cod_ccaa.includes("04")
          ? "translate(230,-290)"
          : "";
        const dAttr = pathGenerator(feature) || "";
        const match = data.find((dp) => dp.code === codeValue);
        const fill = match ? colorScale(match.value) : "#ccc";
        const total = match ? match.value : 0;

        return (
          <path
            key={i}
            d={dAttr}
            fill={fill}
            stroke="#fff"
            transform={transform}
            onClick={() =>
              onRegionClick && onRegionClick({ name: nameValue, total })
            }
          >
            <title>
              {nameValue} - Total: {total}
            </title>
          </path>
        );
      })}
    </svg>
  );
};