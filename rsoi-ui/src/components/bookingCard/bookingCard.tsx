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
import Link from '@mui/material/Link';
import {RoomStatuses} from '../../interfaces/IHotel';
import {api} from '../../modules/api';
import {PaymentStatuses} from '../../interfaces/IPayment';

interface IProps {
    id: number;
    created: string,
    hotel_title: string,
    hotel_city: string,
    hotel_address: string,
    room_number: number,
    room_status: string,
    room_cost: number,
    payment_status: string
}

interface IState {
    id: number;
    created: string,
    hotel_title: string,
    hotel_city: string,
    hotel_address: string,
    room_number: number,
    room_status: string,
    room_cost: number,
    payment_status: string
}

export class BookingCard extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {...props};
        this.payBooking = this.payBooking.bind(this)
        this.reverseBooking = this.reverseBooking.bind(this)
        this.cancelBooking = this.cancelBooking.bind(this)
    }

    async payBooking() {
        const booking = await api.payBooking(this.state.id);

        switch (booking.code) {
            case "200":
                this.setState({
                    ...this.state,
                    payment_status: booking.body.booking.payment_status
                })
                break;
        }
    }

    async reverseBooking() {
        const booking = await api.reverseBooking(this.state.id);

        switch (booking.code) {
            case "200":
                this.setState({
                    ...this.state,
                    payment_status: booking.body.booking.payment_status
                })
                break;
        }
    }

    async cancelBooking() {
        const booking = await api.cancelBooking(this.state.id);

        switch (booking.code) {
            case "200":
                this.setState({
                    ...this.state,
                    payment_status: booking.body.booking.payment_status
                })
                break;
        }
    }

    payedBooking() {
        return (
            <CardActions>
                <Button size="small" onClick={this.reverseBooking}>Return money</Button>
            </CardActions>
        )
    }

    newBooking() {
        return (
            <>
                <CardActions>
                    <Button size="small" onClick={this.payBooking}>Pay</Button>
                    <Button size="small" onClick={this.cancelBooking}>Cancel</Button>
                </CardActions>
            </>
        )
    }

    bookingControlls() {
        if (this.state.payment_status === PaymentStatuses.NEW) {
            return this.newBooking();
        } else if (this.state.payment_status === PaymentStatuses.PAID) {
            return this.payedBooking();
        }
    }

    render() {
        return (
            <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                    gutterBottom variant="h5"
                    component="h2"
                    sx={{cursor: "pointer"}}
                    color="text.primary"
                >
                    {`Hotel: ${this.state.hotel_title}`}
                </Typography>
                <Typography gutterBottom>
                    {`Hotel city: ${this.state.hotel_city}`}
                </Typography>
                <Typography gutterBottom>
                    {`Hotel address: ${this.state.hotel_address}`}
                </Typography>
                <Typography gutterBottom>
                    {`Room №: ${this.state.room_number}`}
                </Typography>
                <Typography gutterBottom>
                    {`Room price: ${this.state.room_cost}`}
                </Typography>
                <Typography gutterBottom>
                    {`Payment status: ${this.state.payment_status}`}
                </Typography>
              </CardContent>
              {
                  this.bookingControlls()
              }
            </Card>
          </Grid>
        )
    }   
}