import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { SpainProvincesGeoJSON } from '../types'; // Ajusta la ruta según corresponda

export const MapComponent: React.FC = () => {
  const [geoData, setGeoData] = useState<SpainProvincesGeoJSON | null>(null);

  useEffect(() => {
    d3.json<SpainProvincesGeoJSON>('/geojson/spain-provinces.geojson')
      .then(data => setGeoData(data!))
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  if (!geoData) {
    return <div>Cargando mapa...</div>;
  }

  const width = 800;
  const height = 600;

  // Configuración de la proyección:
  // Nota: .fitSize ajusta automáticamente la proyección, por lo que agregar center, scale y translate
  // puede no tener efecto o provocar conflictos. Ajusta según lo requieras.
  const projection = geoMercator()
    .fitSize([width, height], geoData)
    .center([-3.9, 38.65])
    .scale(2400)
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg width={width} height={height}>
      {geoData.features.map((feature, index) => {
        // Si la feature pertenece a Canarias, se aplica el translate.
        const transform = feature.properties.cod_ccaa.includes("04")
          ? "translate(230,-260)"
          : "";
        return (
          <path
            key={index}
            d={pathGenerator(feature) || undefined}
            fill="#ccc"
            stroke="#333"
            strokeWidth={1}
            transform={transform}
          >
            <title>{feature.properties.name}</title>
          </path>
        );
      })}
    </svg>
  );
};