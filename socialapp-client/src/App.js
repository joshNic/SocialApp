import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';

import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import themeFile from './util/theme';
import AuthRoute from './util/AuthRoute';

const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		// window.location.href = '/login';
		authenticated = false;
	} else {
		authenticated = true;
	}
}

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<div className='App'>
				<Router>
					<Navbar />
					<div className='container'>
						<Switch>
							<Route exact path='/' component={Home} />
							<AuthRoute
								exact
								path='/login'
								component={Login}
								authenticated={authenticated}
							/>
							<AuthRoute
								exact
								path='/signup'
								component={Signup}
								authenticated={authenticated}
							/>
							{/* <Route exact path='/login' component={Login} />
							<Route exact path='/signup' component={Signup} /> */}
						</Switch>
					</div>
				</Router>
			</div>
		</MuiThemeProvider>
	);
}

export default App;
