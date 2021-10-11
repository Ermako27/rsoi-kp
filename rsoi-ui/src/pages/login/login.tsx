import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ILocalStorage } from '../../interfaces/ILocalStorage';
import { IUserModel } from '../../interfaces/IUser';
import {Redirect} from 'react-router-dom';
import {store} from '../../modules/store';
import {api} from '../../modules/api';

const theme = createTheme();

interface LoginPageState {
	authState: string;	
}

export class LoginPage extends React.Component<any, LoginPageState> {
	constructor(props: any) {
		super(props);
		this.login = this.login.bind(this);
		this.state = {
			authState: "success"
		}
	}

	async login(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});

		const userData = await api.login({
			email: data.get('email') as string,
			password: data.get('password') as string,
		})

		switch (userData.code) {
			case "200":
				this.onSuccessAuth(userData.body.user);
				break;
			default:
				this.onErrorAuth();
				break;
		}
	}

	onSuccessAuth(userData: IUserModel) {
		localStorage.setItem(ILocalStorage.USER_DATA, JSON.stringify(userData));
		localStorage.setItem(ILocalStorage.IS_LOGIN, '1');
		this.setState({
			authState: "success"
		});
	}

	onErrorAuth() {
		this.setState({
			authState: "error"
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
								Sign in
							</Typography>
							<Box component="form" onSubmit={this.login} sx={{ mt: 1 }}>
								<TextField
									error={this.state.authState === 'error' ? true : false}
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								<TextField
									error={this.state.authState === 'error' ? true : false}
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
								Sign In
								</Button>
							</Box>
						</Box>
					</Container>
				</ThemeProvider>
			);
		}
	}
}
