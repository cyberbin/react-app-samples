import React, { useState } from 'react'
import { TableHead, TableRow, TableCell, TableSortLabel, TextField, RadioGroup, Radio } from '@material-ui/core'
import { InputAdornment, Button, Checkbox, Paper, FormControlLabel, Typography, Grid, FormLabel, FormGroup, FormControl } from '@material-ui/core'
import { Label, Search } from "@material-ui/icons"
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const headers = [
    { id: '1', name: 'Sample ID' },
    { id: '2', name: 'Creation Date' },
    { id: '3', name: 'Size' },
    { id: '4', name: 'Quality' },
    { id: '5', name: 'Export' },
    { id: '6', name: 'Delete' },
    { id: '7', name: 'Status' }
]

function TableHeader(props) {
    const { order, orderBy, setOrder, setOrderBy } = props;
    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId);
    }
    return (
        <TableHead>
            <TableRow>
                {headers.map((item) => {
                    return <TableCell key={item.id} align="center" sortDirection={orderBy === item.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === item.id}
                            direction={orderBy === item.id ? order : 'asc'}
                            onClick={() => handleSortRequest(item.id)}> {item.name}
                        </TableSortLabel>
                    </TableCell>
                })}
            </TableRow>
        </TableHead>
    )

}

function FilterBar(props) {

    const { taskFilterFn, setTaskFilterFn, isCompleted, setIsCompleted, isPending, setIsPending, toDate,
        setToDate, fromDate, setFromDate, dateFilterFn, setDateFilterFn, dialogOpen, setDialogOpen ,sampleType, setSampleType} = props;


    const handleIsCompletedChange = (e) => {
        setIsCompleted(!isCompleted);
    }

    const handleIsPendingChange = (e) => {
        setIsPending(!isPending);
    }

    const handleToDateChange = (date) => {
        setToDate(date);
        handleDateFilter();
    }

    const handleFromDateChange = (date) => {
        setFromDate(date);
        handleDateFilter();
    }
    const handleSampleSelectorChange=(event)=>{
        setSampleType(event.target.value);
    }
    const handleClose = () => {
        setDialogOpen(false)
    }

    const handleClickOpen = () => {
        setDialogOpen(true)
    }

    const handleSearchName = (event) => {
        let target = event.target;
        setTaskFilterFn({
            fn: (items) => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => {
                        return String(x.id).toLowerCase().includes(target.value) || String(x.FamilyName).toLowerCase().includes(target.value)
                    }
                    )
            }
        })
    }

    const handleDateFilter = () => {
        setDateFilterFn({
            fn: (items) => {
                return items.filter(x => {
                    let dateToCompare = new Date(x.createdDate);
                    console.log("Date to Compare Day :" + dateToCompare.getDate() + " : Month : " + dateToCompare.getMonth() + " of year " + dateToCompare.getFullYear());
                    console.log("Date between day :" + fromDate.getDate() + " : Month : " + fromDate.getMonth() + " of year " + fromDate.getFullYear());
                    console.log("Date between day :" + toDate.getDate() + " : Month : " + toDate.getMonth() + " of year " + toDate.getFullYear());
                    console.log(dateToCompare > fromDate && dateToCompare < toDate);

                    return dateToCompare > fromDate && dateToCompare < toDate;
                }
                )
            }
        })
    }

    return (
        <>
            <Paper >
                <Grid container alignItems="center" style={{ padding: '20px' }}>
                    <Grid item sm={2}>
                        <TextField InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), }} label="Task Id" name="searchBar" variant="outlined" onChange={handleSearchName} />
                    </Grid>
                    <Grid item sm={2} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker format="dd/MM/yyyy" id="fromDate" label="From Date" value={fromDate} onChange={date => handleFromDateChange(date)} />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item sm={2} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker format="dd/MM/yyyy" id="toDate" label="To Date" value={toDate} onChange={date => handleToDateChange(date)} />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item sm={1}>   <FormLabel component="legend"></FormLabel></Grid>
                    <Grid item sm={1}>   <FormLabel component="legend">Status</FormLabel></Grid>
                    <Grid item sm={2}>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={isPending} onChange={handleIsPendingChange} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Pending" />
                            <FormControlLabel control={
                                <Checkbox checked={isCompleted} onChange={handleIsCompletedChange} inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Completed" />
                        </FormGroup>

                    </Grid>
                    <Grid item sm={true}></Grid>
                </Grid>

                <Grid container style={{ padding: '20px' }}>
                    <Grid item sm={1}>  <Typography variant="h6"> Agent Name: </Typography> </Grid>
                    <Grid item sm={1}><Typography variant="h6">Sample Name </Typography>  </Grid>
                    <Grid item sm={1}> </Grid>
                    <Grid item sm={1}>  <Typography variant="h6"> Project Number: </Typography> </Grid>
                    <Grid item sm={1}> <Typography variant="h6"> 1234567 </Typography>   </Grid>
                    <Grid item sm={1}> </Grid>
                    <Grid item sm={2}>   <Button variant="contained" color="secondary" onClick={handleClickOpen}> Create Sample </Button>  </Grid>
                    <Grid item sm={true}></Grid>
                </Grid>

                <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Sample</DialogTitle>
                    <DialogContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Sample Type</FormLabel>
                            <RadioGroup aria-label="sampleType" name="sampleType" value={sampleType} onChange={handleSampleSelectorChange}>
                                <FormControlLabel value="everyNtask" control={<Radio />} label="Every N Tasks" />
                                <FormControlLabel value="fullBatch" control={<Radio />} label="100% in the Batch" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoFocus
                            id="tasks"
                            label="Tasks"
                            type="number"
                            fullWidth
                            variant = "outlined"
                            disabled = {sampleType == "everyNtask"? false : true}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={handleClose} color="primary">
                            Create Sample
            </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </>
    )
}

export { TableHeader, FilterBar }
