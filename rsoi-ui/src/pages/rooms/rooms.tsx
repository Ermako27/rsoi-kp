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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Header } from '../../components/header/header';
import {RoomCard} from '../../components/roomCard/roomCard';
import { api } from '../../modules/api';
import {Link} from 'react-router-dom'
import {store} from '../../modules/store';


const theme = createTheme();


interface IState {
	entities: any[],
	hotel_id: number;
	title: string;
}

export class RoomsPage extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			hotel_id: -1,
			title: '',
			entities: []
		};
	}

	async componentDidMount() {
		console.log(window.location);
		const hotelId = Number(window.location.pathname.split('/')[2]);
		// TODO сделать экран с ошибкой что отель не найден
		const hotel = await api.getHotel(hotelId);
		const hotelRooms = await api.getHotelRooms(hotelId);

		this.setState({
			title: hotel.body.hotel.title,
			hotel_id: hotel.body.hotel.id,
			entities: hotelRooms.body.rooms
		})
	}

    render() {
		const isLogin = store.isLogin();
        const isAdmin = store.isAdmin();
        return (
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header/>
            <main>
				<Container>
					<Typography
						component="h1"
						variant="h2"
						align="center"
						color="text.primary"
					>
						{`Hotel: ${this.state.title}`}
					</Typography>
					{
						isLogin && isAdmin &&
						<Stack
						sx={{ pt: 4 }}
						direction="row"
						spacing={2}
						justifyContent="center"
						>
							<Link to={`/hotels/${Number(window.location.pathname.split('/')[2])}/rooms/create`}>
								<Button variant="contained">
									Create Room
								</Button>
							</Link>
						</Stack>
					}
				</Container>
				<Container sx={{ py: 8 }} maxWidth="md">
					{/* End hero unit */}
					<Grid container spacing={4}>
					{this.state.entities.map((entity) => (
						<RoomCard 
							id={entity.id}
							hotel_id={this.state.hotel_id}
							key={entity.id}
							room_cost={entity.room_cost}
							room_status={entity.room_status}
							room_number={entity.room_number}
						/>
					))}
					</Grid>
				</Container>
            </main>
          </ThemeProvider>
        )
    }
}