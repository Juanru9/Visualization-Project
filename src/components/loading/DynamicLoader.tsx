import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface DynamicLoaderProps {
  loading: boolean;
  message?: string;
}

export const DynamicLoader: React.FC<DynamicLoaderProps> = ({ loading, message = 'Cargando...' }) => {
  if (!loading) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100vh' }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};