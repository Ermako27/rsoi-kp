import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Header } from '../../components/header/header';
import { HotelCard } from '../../components/hotelCard/hotelCard';
import { api } from '../../modules/api';
import { store } from '../../modules/store';
import {ILoyaltyModel} from '../../interfaces/ILoyalty';
import {IBookingModel} from '../../interfaces/IBooking';
import {BookingCard} from '../../components/bookingCard/bookingCard';
import {Redirect} from 'react-router-dom';
import {IPaymentReport} from '../../interfaces/IReport'

import {Table} from '@mui/material';
import {TableBody} from '@mui/material';
import { TableCell } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';

const theme = createTheme();

interface IState {
    entities: IPaymentReport[],
}

export class UsersReportPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            entities: []
        }
    }

    async componentDidMount() {
        const report = await api.getUsersReport();

        if (report.code === '200') {
            this.setState({
                entities: report.body.report
            })
        }
    }

    render() {
        const isLogin = store.isLogin();
        const isAdmin = store.isAdmin();
        if (!isLogin || !isAdmin) {
            return (
				<Redirect to={{pathname: '/'}}/>
			)
        } else {
            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Header/>
                    <Container>
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                        >
                            Users booking stats
                        </Typography>
                    </Container>
                    <Container sx={{ py: 8 }} maxWidth="md">
                        <Paper>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell>User id</TableCell>
                                    <TableCell align="right">Username</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right">Unpaid</TableCell>
                                    <TableCell align="right">Paid</TableCell>
                                    <TableCell align="right">Reversed</TableCell>
                                    <TableCell align="right">Canceled</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.entities.map(entity => (
                                        <TableRow key={entity.id}>
                                            <TableCell component="th" scope="row">{entity.user_id}</TableCell>
                                            <TableCell align="right">{entity.username}</TableCell>
                                            <TableCell align="right">{entity.total_count}</TableCell>
                                            <TableCell align="right">{entity.unpaid}</TableCell>
                                            <TableCell align="right">{entity.paid}</TableCell>
                                            <TableCell align="right">{entity.reversed}</TableCell>
                                            <TableCell align="right">{entity.canceled}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Container>
                </ThemeProvider>
            )
        }
    }
}