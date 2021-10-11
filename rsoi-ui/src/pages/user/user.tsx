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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Header } from '../../components/header/header';
import { HotelCard } from '../../components/hotelCard/hotelCard';
import { api } from '../../modules/api';
import { store } from '../../modules/store';
import {ILoyaltyModel} from '../../interfaces/ILoyalty';
import {IBookingModel} from '../../interfaces/IBooking';
import {BookingCard} from '../../components/bookingCard/bookingCard';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';


const theme = createTheme();

interface IState {
    entities: IBookingModel[],
    loyalty: ILoyaltyModel
}

export class UserPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            entities: [],
            loyalty: {
                id: 0,
                user_id: 0,
                discount: 0,
                status: ''
            }
        }
    }
    async componentDidMount() {

        const bookingsPromise = api.getUserBookings();
        const loyaltyPromise = api.getUserLoyalty();

        const userData = await Promise.all([bookingsPromise, loyaltyPromise]);

        this.setState({
            entities: userData[0].body.bookings,
            loyalty: userData[1].body.loyalty
        })
        console.log(userData[0].body.bookings);
        console.log(userData[1].body.loyalty);
    }

    render() {
        const user = store.getUserData();
        const isLogin = store.isLogin();
        const isAdmin = store.isAdmin();
        if (!isLogin) {
            return (
				<Redirect to={{pathname: '/'}}/>
			)
        } else {
            return (
                <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header/>
                <main>
                  {/* Hero unit */}
                    <Container sx={{ py: 8 }} maxWidth="md">
                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200', width: "100%" }}>
                                <Typography gutterBottom>
                                    {`Name: ${user.username}`}
                                </Typography>
                                <Typography gutterBottom>
                                    {`Loyalty status: ${this.state.loyalty.status}`}
                                </Typography>
                                <Typography gutterBottom>
                                    {`Discount: ${this.state.loyalty.discount}%`}
                                </Typography>
                            </Paper>
                            {
                                isLogin && isAdmin &&
                                <Stack
                                    sx={{ pt: 4, pb: 4 }}
                                    direction="row"
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <Link to={`/user/report`}>
                                        <Button variant="contained">
                                            Users stats
                                        </Button>
                                    </Link>
                                </Stack>
						    }
                        <Grid container spacing={4}>
                            {this.state.entities.map((entity) => (
                                <BookingCard 
                                    id={entity.id}
                                    key={entity.id}
                                    hotel_title={entity.hotel_title}
                                    hotel_city={entity.hotel_city}
                                    hotel_address={entity.hotel_address}
                                    room_number={entity.room_number}
                                    room_status={entity.room_status}
                                    room_cost={entity.room_cost}
                                    payment_status={entity.payment_status}
                                    created={entity.created}
                                />
                            ))}
                        </Grid>
                    </Container>
                </main>
              </ThemeProvider>
            )
        }
    }
}