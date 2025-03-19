'use client';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    cssVariables: true,
    colorSchemes: {light: true, dark: true},
});

export default theme;