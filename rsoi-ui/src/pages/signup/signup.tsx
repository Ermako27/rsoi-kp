
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

const theme = createTheme();

interface ISignUpState {
    signUpState: string;
}

export class SignUpPage extends React.Component<any, ISignUpState> {
    constructor(props: ISignUpState) {
        super(props);
        this.signup = this.signup.bind(this);
        this.state = {
			signUpState: "success"
		}
    }

    async signup(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
		});

        const newUser = await api.signUp({
            username: data.get('username') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
            role: 'COMMON'
        });

        switch (newUser.code) {
			case "200":
				await this.onSuccessSignUp(
                    data.get('email') as string,
                    data.get('password') as string,
                    newUser.body.user
                );
				break;
            default:
                this.onErrorSignUp();
				break
		}
    }

    async onSuccessSignUp(email: string, password: string, userData: IUserModel) {
		const loginedUserData = await api.login({
			email,
			password
		})

        switch (loginedUserData.code) {
			case "200":
                localStorage.setItem(ILocalStorage.USER_DATA, JSON.stringify(userData));
                localStorage.setItem(ILocalStorage.IS_LOGIN, '1');
                this.setState({
                    signUpState: "success"
                });
				break;
			default:
				this.onErrorSignUp();
				break;
		}
    }

    onErrorSignUp() {
		this.setState({
			signUpState: "error"
		});
		localStorage.setItem(ILocalStorage.IS_LOGIN, '0');
    }

    render() {
        if (store.isLogin()) {
			return (
				<Redirect to={{pathname: '/'}}/>
			)
        } else {
            return (
                <ThemeProvider theme={theme}>
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
                      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                      </Avatar>
                      <Typography component="h1" variant="h5">
                        Sign up
                      </Typography>
                      <Box component="form" noValidate onSubmit={this.signup} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.signUpState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="username"
                                    label="User name"
                                    name="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.signUpState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={this.state.signUpState === 'error' ? true : false}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                          Sign Up
                        </Button>
                      </Box>
                    </Box>
                  </Container>
                </ThemeProvider>
            );
        }
    }
}