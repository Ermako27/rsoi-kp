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
import { HotelCard } from '../../components/hotelCard/hotelCard';
import { api } from '../../modules/api';
import {Link} from 'react-router-dom';
import {store} from '../../modules/store';


const theme = createTheme();


interface IState {
	entities: any[]
}

export class HotelsPage extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			entities: []
		};
	}

	async componentDidMount() {
		const result = await api.getHotels();
		this.setState({
			entities: result.body.hotels
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
							{`Hotels`}
						</Typography>
						{
							isLogin && isAdmin &&
							<Stack
							sx={{ pt: 4 }}
							direction="row"
							spacing={2}
							justifyContent="center"
							>
								<Link to={`/hotels/create`}>
									<Button variant="contained">
										Create Hotel
									</Button>
								</Link>
							</Stack>
						}
					</Container>
				{/* Hero unit */}
					<Container sx={{ py: 8 }} maxWidth="md">
						{/* End hero unit */}
						<Grid container spacing={4}>
							{this.state.entities.map((entity) => (
								<HotelCard 
									id={entity.id}
									key={entity.id}
									title={entity.title}
									city={entity.city}
									hotel_address={entity.hotel_address}
									rooms_count={entity.rooms_count}
								/>
							))}
						</Grid>
					</Container>
				</main>
          	</ThemeProvider>
        )
    }
}