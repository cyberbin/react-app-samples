import React, { Component } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, withStyles } from "@material-ui/core"
import { InputAdornment, Button, TextField, Paper, FormControlLabel, Switch, FormControl, TableSortLabel, Toolbar } from "@material-ui/core"
import { Search } from "@material-ui/icons"
import axios from 'axios';
import "./userTable.css"




export class UserTable extends Component {


    constructor(props) {
        super(props)

        this.state = {
            order: "",
            orderBy: "",
            activeUsersChecked: false,
            rowsPerPage: 10,
            page: 0,
            rows: [],
            fitler: 22,
            filterFn: { fn: (items) => { return items } }
        }
    }



    componentDidMount() {
        //Add URL to get data here 
        axios.get("")
            .then(response => {
                this.setState({
                    rows: response.data
                });
            });
    }

    render() {

        // Dummy Data 
        const rows = [{ Givenname: 'Donut', settings: 452, twofactauth: 25, status: "Active" },
        { Givenname: 'Eclair', settings: 262, twofactauth: 16, status: "Inactive" }]


        const { filterFn, order, orderBy, rowsPerPage, page, row, activeUsersChecked } = this.state;

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

        const handleChangePage = (event, newPage) => {
            this.setState({
                page: newPage
            });
        };



        const handleChangeRowsPerPage = (event) => {
            this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
            });
        };

        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            this.setState({
                order: isAsc ? 'desc' : 'asc',
                orderBy: cellId
            });
        }

        const toggleChecked = (event, newPage) => {
            this.setState({
                activeUsersChecked: !activeUsersChecked
            });
        };

        const handleSearchName = (event) => {
            let target = event.target;
            this.setState({
                filterFn: {
                    fn: (items) => {
                        if (target.value == "")
                            return items;
                        else
                            return items.filter(x => {
                                // Add Active filter here
                                return String(x.Givenname).toLowerCase().includes(target.value) || String(x.FamilyName).toLowerCase().includes(target.value)
                            }
                            )
                    }
                }
            })
        }



        const headCells = [
            { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
            { id: 'settings', numeric: true, disablePadding: false, label: 'Settings' },
            { id: 'twofactauth', numeric: true, disablePadding: false, label: 'Two Factor Auth' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
            { id: 'manage', numeric: true, disablePadding: false, label: 'Activate/Deactivate' },
        ];

        function stableSort(array, comparator) {
            const stabilizedThis = array.map((el, index) => [el, index]);
            stabilizedThis.sort((a, b) => {
                const order = comparator(a[0], b[0]);
                if (order !== 0) return order;
                return a[1] - b[1];
            });
            return stabilizedThis.map((el) => el[0]);
        }

        function getComparator(order, orderBy) {
            return order === 'desc'
                ? (a, b) => descendingComparator(a, b, orderBy)
                : (a, b) => -descendingComparator(a, b, orderBy);
        }

        function descendingComparator(a, b, orderBy) {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }

        const recordsAfterPagingAndSorting = () => {
            // return stableSort(rows, getComparator(order, orderBy))
            return stableSort(filterFn.fn(activeSwitchFilter()), getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
        }

        const activeSwitchFilter = () => {
            let activeData = rows

            if (activeUsersChecked) {
                activeData = rows.filter((item) => {
                    return item.status.toLocaleLowerCase() == "active"
                })
            }

            return activeData;
        }

        return (
            <div>
                <div className="flexContainer">  <TextField InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), }}
                    label="Search Names" className="searcbar" fullwidth="true" name="searchBar" variant="outlined" onChange={handleSearchName} />
                    <div><FormControlLabel className="activeSwitch" large control={<Switch checked={activeUsersChecked} onChange={toggleChecked} />} label="Active" />
                        <Button variant="contained" color="secondary"> Create User </Button>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table stickyHeader={true} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {
                                    headCells.map(headCell => (
                                        <TableCell sortDirection={orderBy === headCell.id ? order : false}
                                            align="center" key={headCell.id}>
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={() => handleSortRequest(headCell.id)}>
                                                {headCell.label}
                                            </TableSortLabel>
                                        </TableCell>))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {recordsAfterPagingAndSorting().map((row) => (
                                <TableRow key={row.UserId}>
                                    <TableCell align="center" scope="row">
                                        {row.Givenname + " " + row.FamilyName}
                                    </TableCell>
                                    <TableCell align="center"><Button variant="contained" color="primary">Settings</Button></TableCell>
                                    <TableCell align="center">{row.settings}</TableCell>
                                    <TableCell align="center">Dummy Data</TableCell>
                                    <TableCell align="center"><Button variant="contained" color="primary">Manage</Button></TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 70 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div >
        )
    }
}

export default UserTable
