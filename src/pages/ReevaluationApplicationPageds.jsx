import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Alert,
  Chip,
} from "@mui/material";
import ep1 from "../api/ep1";
import global1 from "./global1";

function ReevaluationApplicationPageds() {
  const [searchParams, setSearchParams] = useState({
    regno: global1.regno || "",
    program: "",
    branch: "",
    regulation: "",
    semester: "",
    year: "",
  });

  const [failedPapers, setFailedPapers] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const years = Array.from({ length: 15 }, (_, i) => 2020 + i);
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearchFailedPapers = async () => {
    if (!searchParams.regno || !searchParams.program || !searchParams.branch) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await ep1.get("/api/v2/reevaluation/failed-papersds", {
        params: searchParams,
      });
      setFailedPapers(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching failed papers");
    }
  };

  const handleApplyReevaluation = async (paper) => {
    try {
      const totalObtained =
        (paper.thobtained || 0) +
        (paper.probtained || 0) +
        (paper.iatobtained || 0) +
        (paper.iapobtained || 0);

      const applicationData = {
        name: global1.name,
        user: global1.user,
        colid: global1.colid,
        student: paper.student,
        regno: paper.regno,
        program: paper.program,
        examcode: paper.examcode,
        month: paper.month,
        year: paper.year,
        regulation: paper.regulation,
        semester: paper.semester,
        branch: paper.branch,
        papercode: paper.papercode,
        papername: paper.papername,
        originalmarks: totalObtained,
      };

      const res = await ep1.post("/api/v2/reevaluation/applyds", applicationData);
      setSuccess("Reevaluation application submitted successfully!");
      setError("");
      
      // Refresh applications
      fetchMyApplications();
    } catch (err) {
      setError(err.response?.data?.error || "Error applying for reevaluation");
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await ep1.get("/api/v2/reevaluation/listds", {
        params: { regno: global1.regno },
      });
      setMyApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "stage1":
        return "info";
      case "stage2":
        return "secondary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reevaluation Application
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Failed Papers
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
              label="Registration Number"
              name="regno"
              value={searchParams.regno}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Program"
              name="program"
              value={searchParams.program}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Branch"
              name="branch"
              value={searchParams.branch}
              onChange={handleChange}
              size="small"
            />
            <TextField
              label="Regulation"
              name="regulation"
              value={searchParams.regulation}
              onChange={handleChange}
              size="small"
            />
            <TextField
              select
              label="Semester"
              name="semester"
              value={searchParams.semester}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem.toString()}>
                  {sem}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Year"
              name="year"
              value={searchParams.year}
              onChange={handleChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {years.map((yr) => (
                <MenuItem key={yr} value={yr.toString()}>
                  {yr}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleSearchFailedPapers}>
              Search
            </Button>
          </Box>

          {failedPapers.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Paper Code</TableCell>
                  <TableCell>Paper Name</TableCell>
                  <TableCell>Obtained</TableCell>
                  <TableCell>Max</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {failedPapers.map((paper, index) => (
                  <TableRow key={index}>
                    <TableCell>{paper.papercode}</TableCell>
                    <TableCell>{paper.papername}</TableCell>
                    <TableCell>{paper.totalobtained}</TableCell>
                    <TableCell>{paper.totalmax}</TableCell>
                    <TableCell>{paper.percentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleApplyReevaluation(paper)}
                      >
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Reevaluation Applications
          </Typography>

          {myApplications.length === 0 ? (
            <Typography color="text.secondary">
              No applications found
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Paper Code</TableCell>
                  <TableCell>Paper Name</TableCell>
                  <TableCell>Original Marks</TableCell>
                  <TableCell>Final Marks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.papercode}</TableCell>
                    <TableCell>{app.papername}</TableCell>
                    <TableCell>{app.originalmarks}</TableCell>
                    <TableCell>
                      {app.finalmarks ? app.finalmarks : "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(app.applieddate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ReevaluationApplicationPageds;
