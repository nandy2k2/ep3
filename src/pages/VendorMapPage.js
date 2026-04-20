import React, { useEffect, useState } from 'react';
import ep1 from '../api/ep1';
import global1 from './global1';

import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  Paper
} from '@mui/material';

import {
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid';

export default function VendorMapPage() {

  const [rfps, setRfps] = useState([]);
  const [rfpId, setRfpId] = useState('');
  const [rfp, setRfp] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [selection, setSelection] = useState([]);

  /* ================= LOAD RFP LIST ================= */
  useEffect(() => {
    loadRFPs();
  }, []);

  const loadRFPs = async () => {
    const res = await ep1.get(`/vendormapp/rfp?colid=${global1.colid}`);
    setRfps(res.data);
  };

  /* ================= LOAD RFP ================= */
  const loadRFP = async (id) => {

    const res = await ep1.get(`/vendormapp/rfpbyid?id=${id}`);

    setRfp(res.data);

    loadVendors(res.data.categoryid?._id);
    loadSelected(id);
  };

  /* ================= LOAD VENDORS ================= */
  const loadVendors = async (categoryid) => {

    const res = await ep1.get(
      `/vendormapp/vendors?colid=${global1.colid}&categoryid=${categoryid}`
    );

    setVendors(res.data);
  };

  /* ================= LOAD SAVED ================= */
  const loadSelected = async (rfpid) => {

    const res = await ep1.get(`/vendormapp/byrfp?rfpid=${rfpid}`);

    if (res.data?.vendors) {
      setSelection(res.data.vendors.map(v => v.vendorid));
    }
  };

  /* ================= SAVE ================= */
  const save = async () => {

    const selected = vendors.filter(v =>
      selection.includes(v._id)
    );

    if (selected.length === 0) {
      alert('Select vendors');
      return;
    }

    const payload = {
      colid: global1.colid,
      rfpid: rfpId,
      categoryid: rfp.categoryid._id,

      vendors: selected.map(v => ({
        vendorid: v._id,
        vendorname: v.vendorname
      }))
    };

    await ep1.post('/vendormapp/save', payload);

    alert('Saved Successfully');
  };

  return (
    <Grid container spacing={2} padding={2}>

      {/* HEADER */}
      <Grid item xs={12}>
        <Typography variant="h5">
          Vendor Mapping for RFP
        </Typography>
      </Grid>

      {/* RFP DROPDOWN */}
      <Grid item xs={4}>
        <TextField
          select
          fullWidth
          label="Select RFP"
          value={rfpId}
          onChange={(e) => {
            setRfpId(e.target.value);
            loadRFP(e.target.value);
          }}
        >
          {rfps.map(r => (
            <MenuItem key={r._id} value={r._id}>
              {r._id}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* CATEGORY */}
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Category"
          value={rfp?.categoryid?.categoryname || ''}
          disabled
        />
      </Grid>

      {/* GRID */}
      <Grid item xs={12}>
        <Paper>

          <DataGrid
            rows={vendors.map(v => ({
              id: v._id,
              vendorname: v.vendorname,
              username: v.username
            }))}

            checkboxSelection
            autoHeight

            rowSelectionModel={selection}
            onRowSelectionModelChange={(ids) => setSelection(ids)}

            columns={[
              { field: 'vendorname', headerName: 'Vendor', flex: 1 },
              { field: 'username', headerName: 'Username', flex: 1 }
            ]}

            slots={{ toolbar: GridToolbar }}
          />

        </Paper>
      </Grid>

      {/* SAVE */}
      <Grid item xs={12}>
        <Button variant="contained" onClick={save}>
          Save Vendor Mapping
        </Button>
      </Grid>

    </Grid>
  );
}