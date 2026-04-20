import React, { useState } from 'react';
import {
  Container, Select, MenuItem, Button, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import ep1 from "../api/ep1";
import global1 from "./global1";

export default function GenerateSalary() {

  const [colid, setColid] = useState(global1.colid);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const years = [
    "2026-27","2025-26","2024-25","2023-24","2022-23","2021-22"
  ];

  const handleGenerate = async () => {
    try {
    //   const res = await axios.post('http://localhost:5000/generate-salary', {
    const res = await ep1.post('/generate-salary', {
        colid,
        month,
        year
      });

      alert(res.data.message + " (" + res.data.count + " records)");
    } catch (err) {
      alert("Error generating salary");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 40 }}>
      <Typography variant="h5">Generate Salary</Typography>

      {/* <TextField
        fullWidth
        label="College ID"
        value={colid}
        onChange={(e) => setColid(e.target.value)}
        style={{ marginTop: 20 }}
      /> */}

      <Select
        fullWidth
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        displayEmpty
        style={{ marginTop: 20 }}
      >
        <MenuItem value="">Select Month</MenuItem>
        {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </Select>

      <Select
        fullWidth
        value={year}
        onChange={(e) => setYear(e.target.value)}
        displayEmpty
        style={{ marginTop: 20 }}
      >
        <MenuItem value="">Select Year</MenuItem>
        {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </Select>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        style={{ marginTop: 30 }}
      >
        Generate Salary
      </Button>
    </Container>
  );
}