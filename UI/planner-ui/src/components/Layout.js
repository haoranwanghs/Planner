import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

export default function BasicGrid({ Users, Projects, Chart }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <CssBaseline />
      <Container maxWidth={'xl'} sx={{ height: '100%' }}>
        <Box sx={{ flexGrow: 1, marginTop: ' 20px', height: '100%' }}>
          <Grid container spacing={1} sx={{ height: '100%' }}>
            <Grid item xs={2} sx={{ height: '100%', overflow: 'scroll' }}>
              <Item>{Users}</Item>
            </Grid>
            <Grid item xs={2}>
              <Item>{Projects}</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>{Chart}</Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
