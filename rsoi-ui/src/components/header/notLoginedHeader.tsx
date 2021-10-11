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
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import {store} from '../../modules/store';

export class NotLoginedHeader extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <Button href="/signup" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    Sign up
                </Button>
                <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    Login
                </Button>
            </>
        )
    }
}