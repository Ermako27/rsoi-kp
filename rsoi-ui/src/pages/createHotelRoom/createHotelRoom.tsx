
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
import MenuItem from '@mui/material/MenuItem';
import { RoomStatuses } from '../../interfaces/IHotel';

const theme = createTheme();

interface ISignUpState {
    createHotelRoomState: string;
    successAlert: string;
}

export class CreateHotelRoomPage extends React.Component<any, ISignUpState> {
    constructor(props: ISignUpState) {
        super(props);
        this.createHotel = this.createHotel.bind(this);
        this.onCloseAlert = this.onCloseAlert.bind(this);
        this.state = {
			createHotelRoomState: "success",
            successAlert: "closed"
		}
    }

    async createHotel(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

        const hotelId = Number(window.location.pathname.split('/')[2]);

		// eslint-disable-next-line no-console
        console.log({
            hotelId,
            room_number: data.get('room_number'),
            room_status: data.get('room_status'),
            room_cost: data.get('room_cost'),
		});

        const newHotelRoom = await api.createHotelRoom(
            hotelId,
            {
                room_number: Number(data.get('room_number')),
                room_status: data.get('room_status') as string,
                room_cost: Number(data.get('room_cost')),
            }
        );

        if (newHotelRoom.code === "200") {
            this.onSuccesCreateHotel();
        } else {
            this.onErrorCreateHotel()
        }
    }

    onErrorCreateHotel() {
        this.setState({
            createHotelRoomState: 'error',
            successAlert: 'closed'
        });
    }

    onSuccesCreateHotel() {
        this.setState({
            createHotelRoomState: 'success',
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
                        Create room
                      </Typography>
                      <Box component="form" noValidate onSubmit={this.createHotel} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelRoomState === 'error' ? true : false}
                                    type="number"
                                    required
                                    fullWidth
                                    id="room_number"
                                    label="Room №"
                                    name="room_number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelRoomState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="room_status"
                                    label="Room status"
                                    name="room_status"
                                    select
                                >
                                    <MenuItem value={RoomStatuses.AVALIABLE}>
                                        {RoomStatuses.AVALIABLE}
                                    </MenuItem>
                                    <MenuItem value={RoomStatuses.BOOKED}>
                                        {RoomStatuses.BOOKED}
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.createHotelRoomState === 'error' ? true : false}
                                    type="number"
                                    required
                                    fullWidth
                                    id="room_cost"
                                    label="Room price"
                                    name="room_cost"
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