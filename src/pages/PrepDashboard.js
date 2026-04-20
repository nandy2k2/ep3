import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { TextField, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ep1 from '../api/ep1';
import global1 from './global1';

export default function PrepDashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = () => {
    ep1
      .get(`/prep/dept-summary?colid=${global1.colid}`)
      .then((res) => setData(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { field: "_id", headerName: "Department", flex: 1 },
    { field: "totalBudget", headerName: "Budget", flex: 1 },
    { field: "totalQty", headerName: "Qty", flex: 1 }
  ];

  return (
    <Grid container spacing={2} p={2}>
      
      {/* SEARCH */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Search Department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Grid>

      {/* GRID */}
      <Grid item xs={12} md={6}>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={data
              .filter(d => d._id?.toLowerCase().includes(search.toLowerCase()))
              .map((d, i) => ({ id: i, ...d }))}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            onRowClick={(params) =>
              navigate(`/prep/department/${params.row._id}`)
            }
          />
        </div>
      </Grid>

      {/* GRAPH */}
      <Grid item xs={12} md={6}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalBudget" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>

    </Grid>
  );
}