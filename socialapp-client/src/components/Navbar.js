import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		flexGrow: 1
// 	},
// 	menuButton: {
// 		marginRight: theme.spacing(2)
// 	},
// 	title: {
// 		flexGrow: 1
// 	}
// }));

export default class Navbar extends Component {
	render() {
		// const classes = useStyles();
		return (
			<AppBar position='static'>
				<Toolbar className='nav-container'>
					<Button color='inherit' component={Link} to='/'>
						Home
					</Button>
					<Button color='inherit' component={Link} to='/signup'>
						Signup
					</Button>
					<Button color='inherit' component={Link} to='/login'>
						Login
					</Button>
				</Toolbar>
			</AppBar>
		);
	}
}
