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
import { LoginedHeader } from './loginedHeader';
import {NotLoginedHeader} from './notLoginedHeader'
import { api } from '../../modules/api';
import {Link} from 'react-router-dom'

interface IState {
    isLogined: boolean
}

export class Header extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            isLogined: store.isLogin()
        }
    }

    async logout() {
        const result = await api.logout();
        switch (result.code) {
			case "200":
				this.onSuccessLogout();
				break;
		}
    }


    onSuccessLogout() {
        store.logout();
        this.setState({
            isLogined: store.isLogin()
        })
    }


    render() {
        const isLogin = store.isLogin();
        return (
            <React.Fragment>
                <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
                <CssBaseline />
                <AppBar
                    position="static"
                    color="default"
                    elevation={0}
                    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                >
                    <Toolbar sx={{ flexWrap: 'wrap' }}>
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            <Link to={`/`}>
                                My booking
                            </Link>
                        </Typography>
                        {/* <nav>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="#"
                                sx={{ my: 1, mx: 1.5 }}
                            >
                            Features
                            </Link>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="#"
                                sx={{ my: 1, mx: 1.5 }}
                            >
                            Enterprise
                            </Link>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="#"
                                sx={{ my: 1, mx: 1.5 }}
                            >
                            Support
                            </Link>
                        </nav> */}
                        {
                            isLogin ? 
                                <LoginedHeader onClick={this.logout}/> :
                                <NotLoginedHeader/>

                        }
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}