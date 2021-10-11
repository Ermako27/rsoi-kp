import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import {store} from '../../modules/store';
import {Link} from 'react-router-dom'


interface IProps {
    onClick: () => Promise<void>
}

export class LoginedHeader extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const userData = store.getUserData();
        return (
            <>
                <Link to={`/user`}>
                    <Typography variant="h6" color="inherit" noWrap>
                        {userData.username}
                    </Typography>
                </Link>
                <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={this.props.onClick}>
                    Logout
                </Button> 
            </>
        )
    }
}