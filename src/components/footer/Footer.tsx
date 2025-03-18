import {Typography} from "@mui/material";

export const Footer = () => (
  <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#eee', marginTop: '20px' }}>
    <Typography variant="body2">&copy; {new Date().getFullYear()} Emberlog. All Rights Reserved. Built with &heartsuit;</Typography>
  </footer>
);