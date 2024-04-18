import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Dashboard() {
    return (
        <Container component="main" maxWidth="lg">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h4">
                    Dashboard
                </Typography>
                <Box sx={{ mt: 3, mb: 3, width: '100%' }}>
                    <Grid container spacing={3}>
                        {/* User Info */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <AccountCircle sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h6">Welcome, User!</Typography>
                                <Typography variant="body2">Your email: user@example.com</Typography>
                            </Paper>
                        </Grid>
                        {/* Widget 1 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6">Widget 1</Typography>
                                <Typography>Info 1</Typography>
                            </Paper>
                        </Grid>
                        {/* Widget 2 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6">Widget 2</Typography>
                                <Typography>Info 2</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Dashboard;
