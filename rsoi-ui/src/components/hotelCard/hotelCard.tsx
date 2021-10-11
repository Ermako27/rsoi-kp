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
import {Link} from 'react-router-dom'

interface IProps {
    id: number
    title: string;
    city: string;
    hotel_address: string;
    rooms_count: number;
}

export class HotelCard extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Link to={`/hotels/${this.props.id}/rooms`}>
                    <Typography 
                        gutterBottom variant="h5"
                        component="h2"
                        sx={{cursor: "pointer"}}
                        color="text.primary"
                    >
                        {this.props.title}
                    </Typography>
                </Link>
                <Typography gutterBottom>
                    {`City: ${this.props.city}`}
                </Typography>
                <Typography gutterBottom>
                    {`Address: ${this.props.hotel_address}`}
                </Typography>
                <Typography gutterBottom>
                    {`Total rooms: ${this.props.rooms_count}`}
                </Typography>
              </CardContent>
              {/* <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
              </CardActions> */}
            </Card>
          </Grid>
        )
    }   
}