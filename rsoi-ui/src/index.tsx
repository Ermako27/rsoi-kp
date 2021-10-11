import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import './index.css';

import {LoginPage} from './pages/login/login';
import {HotelsPage} from './pages/hotels/hotels';
import {SignUpPage} from './pages/signup/signup';
import {RoomsPage} from './pages/rooms/rooms';
import {UserPage} from './pages/user/user';
import {CreateHotelPage} from './pages/createHotel/createHotel';
import {CreateHotelRoomPage} from './pages/createHotelRoom/createHotelRoom';
import {UsersReportPage} from './pages/userStats/userStats';

export class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/'>
						<HotelsPage/>
					</Route>
					<Route exact path="/hotels/:id/rooms">
          				<RoomsPage/>
        			</Route>
					<Route exact path="/hotels/create">
          				<CreateHotelPage/>
        			</Route>
					<Route exact path="/hotels/:id/rooms/create">
          				<CreateHotelRoomPage/>
        			</Route>
					<Route exact path='/login'>
						<LoginPage/>
					</Route>
					<Route exact path='/signup'>
						<SignUpPage/>
					</Route>
					<Route exact path='/user'>
						<UserPage/>
					</Route>
					<Route exact path='/user/report'>
						<UsersReportPage/>
					</Route>
					
				</Switch>
			</BrowserRouter>
		)
	}
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
