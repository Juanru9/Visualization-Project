import React from 'react';
import { Container, Box, Typography, Card, CardContent, Link, Divider } from '@mui/material';

export const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Relación entre el Turismo y el Mercado Hipotecario en España
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Análisis de la influencia de la llegada de turistas en el precio medio de las hipotecas
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              <strong>Introducción:</strong> España ha experimentado un crecimiento récord en la llegada de turistas internacionales, mientras que, paralelamente, el mercado hipotecario muestra un incremento en el precio medio de las hipotecas. Este proyecto analiza la posible correlación entre ambos fenómenos.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Ampliación de Datos:</strong> Con el fin de enriquecer el análisis, se han incorporado variables económicas adicionales que permiten estudiar la evolución de los tipos de interés, el PIB y la renta per cápita. Este enfoque multidimensional ayuda a explorar si el importe medio de las hipotecas está directamente relacionado con el precio medio de la vivienda.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Metodología y Modelo de Datos:</strong> 
              Se integran datos oficiales del Instituto Nacional de Estadística (INE) utilizando fuentes como{' '}
              <Link href="https://www.ine.es/dyngs/Prensa/es/FRONTUR1124.htm" target="_blank" rel="noopener noreferrer">
                FRONTUR/Egatur
              </Link>{' '}
              para el turismo y{' '}
              <Link href="https://www.ine.es/dyngs/Prensa/es/H0924.htm" target="_blank" rel="noopener noreferrer">
                Hipotecas
              </Link>{' '}
              para el mercado hipotecario. Los datos se transforman y cargan en un modelo que permite análisis temporales y geográficos, mostrando tendencias mediante gráficos comparativos y mapas de calor.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Preguntas Clave:</strong> 
              ¿Existe una relación directa entre el importe medio de las hipotecas y el precio medio de la vivienda? ¿En qué medida el auge turístico influye en la presión del mercado inmobiliario? Responder a estas preguntas podría aportar información valiosa para la elaboración de políticas urbanas y de vivienda.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Conclusiones y Futuras Líneas de Investigación:</strong> 
              Los análisis preliminares sugieren patrones temporales que podrían indicar una correlación entre el incremento turístico y la presión en el mercado hipotecario. Las conclusiones obtenidas servirán de base para investigaciones futuras, ampliando el análisis a nivel regional y profundizando en la causalidad mediante modelos estadísticos.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center">
            Fuente: Instituto Nacional de Estadística (INE)
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
