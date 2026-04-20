import React, { useEffect, useState } from 'react';
import ep1 from '../api/ep1';
import global1 from './global1';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function ApprovalPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await ep1.get(`/indent?colid=${global1.colid}`);
    setRows(res.data);
  };

  const approve = async (id) => {
    await ep1.post(`/indent/approve/${id}`, {
      role: global1.role
    });
    load();
  };

  // 🔥 ROLE-STATUS MATCH FUNCTION
  const canApprove = (status) => {
    const role = global1.role;

    if (role === 'HOD' && status === 'HOD_PENDING') return true;
    if (role === 'REGISTRAR' && status === 'REGISTRAR_PENDING') return true;
    if (role === 'ACCOUNTS' && status === 'ACCOUNTS_PENDING') return true;
    if (role === 'MANAGEMENT' && status === 'MANAGEMENT_PENDING') return true;

    return false;
  };

  return (
    <DataGrid
      rows={rows}
      getRowId={(r) => r._id}
      columns={[
        { field: 'itemname', headerName: 'Item', flex: 1 },
        { field: 'quantity', headerName: 'Qty', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },

        {
          field: 'action',
          headerName: 'Action',
          renderCell: (params) => {
            const allowed = canApprove(params.row.status);

            return allowed ? (
              <Button
                variant="contained"
                onClick={() => approve(params.row._id)}
              >
                Approve
              </Button>
            ) : (
              <Button disabled variant="outlined">
                Not Allowed
              </Button>
            );
          }
        }
      ]}
      autoHeight
      slots={{ toolbar: GridToolbar }}
    />
  );
}