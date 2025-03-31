import { FeatureCollection, Geometry } from "geojson";

export interface DataPoint {
  name: string;
  value: number;
}

export interface TourismDataPoint {
  code: string;
  name: string;
  value: number;
}

// Nuevo tipo para el gráfico de barras agrupadas
export interface GroupedDataPoint {
  name: string;
  valueForeigners: number;
  valueHipotecas: number;
}

export interface ExtranjerosHipotecasItem {
  Comunidades: string;
  Anio: string;
  Mes: string;
  TotalTurismo: number;
  TotalHipotecas: number;
  NormalizedTurismo: number;
  NormalizedHipotecas: number;
}

export interface TimeSeriesDataPoint {
  year: number;
  totalTurismo: number;
  totalHipotecas: number;
}
type TimeSeriesDataPoints = Array<TimeSeriesDataPoint>

interface EnumViviendasTuristicasComunidades {
  Comunidades: string;
  Anio: string;
  Mes: string;
  Total: number;
}
type ViviendasTuristicasComunidadesData = Array<EnumViviendasTuristicasComunidades>
// Definición del tipo de dato del JSON de viviendas turísticas por provincias
interface EnumViviendasTuristicasProvincias extends EnumViviendasTuristicasComunidades {
  Provincias: string;
}
type ViviendasTuristicasProvinciasData = Array<EnumViviendasTuristicasProvincias>

// Define las propiedades específicas para cada provincia
export interface SpainProvinceProperties {
  cod_prov: string;
  name: string;
  cod_ccaa: string;
  cartodb_id: number;
  created_at: string;
  updated_at: string;
}


// Tipo que representa cada registro del JSON de PIB e Hipotecas
export interface PIBHipotecasItem {
  Año: string;
  Trimestre: number;
  PIB_Millones: number;
  Numero_Total_Hipotecas: number;
  PIB_Normalizado: number;
  Hipotecas_Normalizadas: number;
}
type PIBHipotecasJSON = Array<PIBHipotecasItem>

// Tipo para los puntos de la serie temporal que usaremos en el gráfico
export interface TimeSeriesPIBHipotecasDataPoint {
  year: Date;
  normalizedPIB: number;
  normalizedHipotecas: number;
}

// Tipo que representa cada registro del JSON de Hipotecas y Tipos de Interés
export interface HipotecasTiposInteresItem {
  Anio: string;
  Mes: string;
  Hipotecas_Nacional: number;
  Tipo_Interes: number;
}
type HipotecasTiposInteresJSON = Array<HipotecasTiposInteresItem>


export interface HipotecasRentaItem {
  Año: string;
  Comunidades_Autonomas: string;
  Hipotecas_Anual: number;
  RentaMedia: number;
  Ratio: number;
  Relacion_Normalizada: number;
}
type HipotecasRentaJSON = Array<HipotecasRentaItem>


// Nuestro GeoJSON es una colección de features cuyo geometry es de tipo Geometry
// y las properties son de tipo SpainProvinceProperties
export type SpainProvincesGeoJSON = FeatureCollection<Geometry, SpainProvinceProperties>;

export interface SpainCommunitiesProperties {
  cod_ccaa: string;
  noml_ccaa: string;
  name: string;
  wikipedia: string;
  cartodb_id: number;
  created_at: Date;
  updated_at: Date;
}
export type SpainCommunitiesGeoJSON = FeatureCollection<Geometry, SpainCommunitiesProperties>;

export interface ExtranjerosHipotecasItem {
  Comunidades: string;
  Anio: string;
  Mes: string;
  TotalTurismo: number;
  TotalHipotecas: number;
  NormalizedTurismo: number;
  NormalizedHipotecas: number;
}
type ExtranjerosHipotecasJSON = Array<ExtranjerosHipotecasItem>