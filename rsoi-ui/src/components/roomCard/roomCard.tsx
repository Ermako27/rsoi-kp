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
import {store} from '../../modules/store';

interface IProps {
    id: number;
    hotel_id: number;
    room_number: number;
    room_status: string;
    room_cost: number;
}

interface IState {
    id: number;
    hotel_id: number;
    room_number: number;
    room_status: string;
    room_cost: number;
}

export class RoomCard extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {...props};
        this.bookRoom = this.bookRoom.bind(this);
    }

    async bookRoom() {
        const booking = await api.bookRoom(
            this.state.id,
            this.state.hotel_id,
            this.state.room_cost
        )

        switch (booking.code){
            case "200":
                this.onSuccessBooking();
                break;
        }
    }

    onSuccessBooking() {
        this.setState({
            ...this.state,
            room_status: RoomStatuses.BOOKED
        });
    }

    render() {
        const isLogin = store.isLogin();
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
                    {`Room №: ${this.state.room_number}`}
                </Typography>
                <Typography gutterBottom>
                    {`Price: ${this.state.room_cost}`}
                </Typography>
                <Typography gutterBottom>
                    {`Status: ${this.state.room_status}`}
                </Typography>
              </CardContent>
              {
                this.state.room_status === RoomStatuses.AVALIABLE && isLogin &&
                <CardActions>
                    <Button size="small" onClick={this.bookRoom}>Book</Button>
                </CardActions>

              }
            </Card>
          </Grid>
        )
    }   
}