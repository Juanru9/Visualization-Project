import { FeatureCollection, Geometry } from "geojson";

export interface DataPoint {
  name: string;
  value: number;
}

export interface BarChartProps {
  data: DataPoint[];
}

// Define las propiedades específicas para cada provincia
export interface SpainProvinceProperties {
  cod_prov: string;
  name: string;
  cod_ccaa: string;
  cartodb_id: number;
  created_at: string;
  updated_at: string;
}
// Nuestro GeoJSON es una colección de features cuyo geometry es de tipo Geometry
// y las properties son de tipo SpainProvinceProperties
export type SpainProvincesGeoJSON = FeatureCollection<Geometry, SpainProvinceProperties>;