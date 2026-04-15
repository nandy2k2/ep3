import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";

import ep1 from "../api/ep1";
import global1 from "./global1";

import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import * as XLSX from "xlsx";

export default function HrSalaryReport() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [breakup, setBreakup] = useState([]);
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    colid: global1.colid,
    month: "",
    year: ""
  });

  // 🔹 Fetch Pivot
  const hrFetchData = async () => {
    // const res = await axios.get("http://localhost:5000/hr/salary-pivot", {
    const res = await ep1.get("/hrsalarypivot", {
      params: filters
    });

    const rows = res.data;

    let cols = new Set();
    rows.forEach(r => {
      Object.keys(r.componentObj || {}).forEach(c => cols.add(c));
    });

    setColumns(Array.from(cols));
    setData(rows);
  };

  // 🔹 Drilldown
  const hrHandleRowClick = async (empid) => {
    // const res = await axios.get("http://localhost:5000/hr/salary-breakup", {
    const res = await ep1.get("hr/salary-breakup", {
      params: { ...filters, empid }
    });

    setBreakup(res.data);
    setOpen(true);
  };

  // 🔹 Excel Export
  const hrExportExcel = () => {
    const exportData = data.map(row => {
      let obj = {
        empid: row.empid,
        employee: row.employee,
        total: row.total
      };

      columns.forEach(col => {
        obj[col] = row.componentObj?.[col] || 0;
      });

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");

    XLSX.writeFile(workbook, "hr_salary_report.xlsx");
  };

  return (
    <Container>
      <h2>HR Salary Pivot Report</h2>

      {/* Filters */}
      {/* <TextField label="ColID"
        onChange={e => setFilters({ ...filters, colid: e.target.value })} /> */}
      <TextField label="Month"
        onChange={e => setFilters({ ...filters, month: e.target.value })} />
      <TextField label="Year"
        onChange={e => setFilters({ ...filters, year: e.target.value })} />

      <Button variant="contained" onClick={hrFetchData}>
        Load
      </Button>

      <Button variant="outlined" onClick={hrExportExcel} style={{ marginLeft: 10 }}>
        Export Excel
      </Button>

      {/* Pivot Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Emp ID</TableCell>
            <TableCell>Employee</TableCell>

            {columns.map(col => (
              <TableCell key={col}>{col}</TableCell>
            ))}

            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => hrHandleRowClick(row.empid)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{row.empid}</TableCell>
              <TableCell>{row.employee}</TableCell>

              {columns.map(col => (
                <TableCell key={col}>
                  {row.componentObj?.[col] || 0}
                </TableCell>
              ))}

              <TableCell>{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Drilldown Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Salary Breakup</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {breakup.map((b, i) => (
                <TableRow key={i}>
                  <TableCell>{b.component}</TableCell>
                  <TableCell>{b.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Container>
  );
}