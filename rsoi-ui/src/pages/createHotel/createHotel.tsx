
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {api} from '../../modules/api';
import { IUserModel } from '../../interfaces/IUser';
import { ILocalStorage } from '../../interfaces/ILocalStorage';
import {store} from '../../modules/store';
import {Redirect} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Header } from '../../components/header/header';

const theme = createTheme();

interface ISignUpState {
    createHotelState: string;
    successAlert: string;
}

export class CreateHotelPage extends React.Component<any, ISignUpState> {
    constructor(props: ISignUpState) {
        super(props);
        this.createHotel = this.createHotel.bind(this);
        this.onCloseAlert = this.onCloseAlert.bind(this);
        this.state = {
			createHotelState: "success",
            successAlert: "closed"
		}
    }

    async createHotel(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
            hotel_title: data.get('hotel_title'),
            city: data.get('city'),
            hotel_address: data.get('hotel_address'),
            rooms_count: data.get('rooms_count'),
		});

        const newHotel = await api.createHotel({
            title: data.get('hotel_title') as string,
            city: data.get('city') as string,
            hotel_address: data.get('hotel_address') as string,
            rooms_count: Number(data.get('rooms_count')),
        });



        if (newHotel.code === "200") {
            this.onSuccesCreateHotel();
        } else {
            this.onErrorCreateHotel()
        }
    }

    onErrorCreateHotel() {
        this.setState({
            createHotelState: 'error',
            successAlert: 'closed'
        });
    }

    onSuccesCreateHotel() {
        this.setState({
            createHotelState: 'success',
            successAlert: 'opened'
        });
    }

    onCloseAlert() {
        this.setState({
            ...this.state,
            successAlert: 'closed'
        });
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
                <Header/>
                  <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                      sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography component="h1" variant="h5">
                        Create Hotel
                      </Typography>
                      <Box component="form" noValidate onSubmit={this.createHotel} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="hotel_title"
                                    label="Hotel title"
                                    name="hotel_title"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="city"
                                    label="City"
                                    name="city"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="hotel_address"
                                    label="Hotel address"
                                    name="hotel_address"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelState === 'error' ? true : false}
                                    type="number"
                                    required
                                    fullWidth
                                    id="rooms_count"
                                    label="Rooms count"
                                    name="rooms_count"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                          create
                        </Button>
                      </Box>
                    </Box>
                    {
                        this.state.successAlert === "opened" && 
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert onClose={this.onCloseAlert}>This is a success alert — check it out!</Alert>
                        </Stack>
                    }
                  </Container>
                </ThemeProvider>
            );
        }
    }
}