import { Button, TextField, InputAdornment, IconButton, Table, TablePagination, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@material-ui/core'
import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Search } from "@material-ui/icons"
import { TableHeader, FilterBar } from './SampleHelper'

const rowsInitial = [
    { id: '123', createdDate: '02-12-2021', size: '100', quality: '85', status: "pending" },
    { id: '124', createdDate: '01-13-2024', size: '20', quality: '56', status: "completed" },
    { id: '125', createdDate: '03-14-2022', size: '8000', quality: '94', status: "pending" },
    { id: '126', createdDate: '06-15-1999', size: '450', quality: '78', status: "completed" },
    { id: '127', createdDate: '05-16-2024', size: '965', quality: '67', status: "pending" },
    { id: '1232', createdDate: '02-12-2021', size: '100', quality: '85', status: "completed" },
    { id: '1224', createdDate: '01-13-2024', size: '20', quality: '56', status: "pending" },
    { id: '1252', createdDate: '03-14-2022', size: '8000', quality: '94', status: "completed" },
    { id: '1262', createdDate: '06-15-1999', size: '450', quality: '78', status: "pending" },
    { id: '1272', createdDate: '05-16-2024', size: '965', quality: '67', status: "completed" },
]


function Sample() {

    const [rows, setRows] = useState(rowsInitial);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('');
    const [orderBy, setOrderBy] = useState('asc');
    const [isPending, setIsPending] = useState(false);
    const [isCompleted, setIsCompleted] = useState(true);
    const [toDate, setToDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date("01-01-2020"));
    const [taskFilterFn, setTaskFilterFn] = useState({
        fn: (items) => {
            return items
        }
    });
    const [dateFilterFn, setDateFilterFn] = useState({
        fn: (items) => {
            return items
        }
    })


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10))
    };

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

    const statusFilterData = (items) => {
        return items.filter((item) => {
            console.log("🚀 ~ file: Sample.js ~ line 96 ~ returnitems.filter ~ tems.status", item.status)
            console.log("🚀 ~ file: Sample.js ~ line 96 ~ returnitems.filter ~ isCompleted", isCompleted)
            console.log("🚀 ~ file: Sample.js ~ line 96 ~ returnitems.filter ~ isPending", isPending)
            if (item.status == "pending" && isPending) {
                return true;
            }
            if (item.status == "completed" && isCompleted) {
                return true;
            }
            return false;
        })

    }

    const recordsAfterPagingAndSorting = () => {
        let dateFilteredData = dateFilterFn.fn(rows);
        let statusFilteredData = statusFilterData(dateFilteredData);
        let taskFilteredData = taskFilterFn.fn(statusFilteredData);
        return stableSort(taskFilteredData, getComparator(order, orderBy)).slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }

    const isCompletedFilter = () => {
        let statusData = rows

        if (isCompleted) {
            statusData = rows.filter((item) => {
                return item.status.toLocaleLowerCase() == "completed"
            })
        }

        return statusData;
    }

    return (
        <div>
            <FilterBar
                taskFilterFn={taskFilterFn} setTaskFilterFn={setTaskFilterFn}
                isPending={isPending} setIsPending={setIsPending}
                isCompleted={isCompleted} setIsCompleted={setIsCompleted}
                toDate={toDate} setToDate={setToDate}
                fromDate={fromDate} setFromDate={setFromDate}
                dateFilterFn={dateFilterFn} setDateFilterFn={setDateFilterFn}
            />
            <Table>
                <TableHeader order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />
                <TableBody>
                    {recordsAfterPagingAndSorting().map((row) => {
                        return (<TableRow key={row.id}>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{row.createdDate}</TableCell>
                            <TableCell align="center">{row.size}</TableCell>
                            <TableCell align="center">{row.quality}</TableCell>
                            <TableCell align="center"><Button variant="contained">Download</Button></TableCell>
                            <TableCell align="center"><IconButton><DeleteIcon /></IconButton></TableCell>
                            <TableCell align="center">{row.status}</TableCell>

                        </TableRow>)
                    })}
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
        </div>
    )
}

export default Sample