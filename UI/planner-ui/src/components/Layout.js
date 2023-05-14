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
    <div style={{ overflow: 'scroll' }}>
      <CssBaseline />
      <Container maxWidth={'xl'} sx={{ overflow: 'scroll' }}>
        <Box sx={{ flexGrow: 1, marginTop: ' 20px', height: '100%' }}>
          <Grid container spacing={1} sx={{ minHeight: '98vh' }}>
            <Grid item xs={3} sx={{ height: '100%', overflow: 'scroll' }}>
              <Item>{Users}</Item>
            </Grid>
            <Grid item xs={4}>
              <Item>{Projects}</Item>
            </Grid>
            <Grid item xs={5}>
              <Item>
                <h3>Project description</h3>
                <span> Planner is a tool to help you automate planing your project. </span>
                <div>
                AdTech needs to have a 18 month plan, which is a painful for TPM and tech leaders. We need to plan projects depending on resource, deadline, and figure out which do we lack of resources. 
So we want to build a tool to helps to create a draft plan.

                </div>
              </Item>
            </Grid>
          </Grid>
          {Chart}
        </Box>
      </Container>
    </div>
  );
}
