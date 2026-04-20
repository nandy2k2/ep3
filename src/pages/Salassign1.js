import React, { useEffect, useState } from 'react';
import {
    Container, Button, Typography, TextField
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

import ep1 from "../api/ep1";
import global1 from "./global1";

export default function SalAssign1() {

    const [employees, setEmployees] = useState([]);
    const [structures, setStructures] = useState([]);

    const [employee, setEmployee] = useState(null);
    const [structure, setStructure] = useState(null);

    const colid = global1.colid;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const emp = await ep1.get(`/sal/employees?colid=${colid}`);
            const str = await ep1.get(`/sal/structures?colid=${colid}`);
            console.log(str.data);
            setEmployees(emp.data);
            setStructures(str.data);
        } catch (err) {
            console.error(err);
            alert('Error loading data');
        }
    };

    const assignSalary = async () => {
        if (!employee || !structure) {
            alert('Please select both Employee and Structure');
            return;
        }

        try {
            await ep1.post('/sal/assign', {
                employeeid: employee._id,
                structureid: structure._id,
                colid
            });

            alert('Salary Assigned');
            setEmployee(null);
            setStructure(null);
        } catch (err) {
            alert('Error assigning salary');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Assign Salary Structure
            </Typography>

            {/* Employee Searchable Dropdown */}
            <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.name || ''}
                value={employee}
                onChange={(e, newValue) => setEmployee(newValue)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Employee" fullWidth />
                )}
                sx={{ mt: 2 }}
            />

            {/* Structure Searchable Dropdown */}
            <Autocomplete
                options={structures}
                getOptionLabel={(option) => option.struture || ''}
                value={structure}
                onChange={(e, newValue) => setStructure(newValue)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Structure" fullWidth />
                )}
                sx={{ mt: 2 }}
            />

            <Button
                variant="contained"
                onClick={assignSalary}
                sx={{ mt: 3 }}
            >
                Assign
            </Button>
        </Container>
    );
}