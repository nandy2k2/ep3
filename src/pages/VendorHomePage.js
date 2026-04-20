import React from 'react';
import { useLocation } from 'react-router-dom';

import {
  Grid,
  Button,
  Typography,
  Paper
} from '@mui/material';

export default function VendorHomePage() {

  const query = new URLSearchParams(useLocation().search);
  const vendorid = query.get('vendorid');

  return (
    <Grid container spacing={3} padding={3}>

      <Grid item xs={12}>
        <Typography variant="h5">
          Vendor Dashboard
        </Typography>
      </Grid>

      {/* PROFILE */}
      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">
            Profile
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              window.location.href =
                `/vendor-profile?id=${vendorid}`
            }
          >
            Edit Profile
          </Button>

        </Paper>
      </Grid>

      {/* RFP */}
      <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">
            RFPs
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              window.location.href =
                `/vendor-rfp?vendorid=${vendorid}`
            }
          >
            View Assigned RFPs
          </Button>

        </Paper>
      </Grid>


       {/* RFP Submit */}
       <Grid item xs={4}>
        <Paper sx={{ p: 2 }}>

          <Typography variant="h6">
            RFPs
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              window.location.href =
                `/vendor-rfp-submit?vendorid=${vendorid}`
            }
          >
            Submmit Assigned RFPs
          </Button>

        </Paper>
      </Grid>

    </Grid>
  );
}