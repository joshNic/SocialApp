import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import MyButton from '../util/MyButton';

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

class Navbar extends Component {
	render() {
		const { authenticated } = this.props;
		return (
			<AppBar position='static'>
				<Toolbar className='nav-container'>
					{authenticated ? (
						<Fragment>
							<MyButton tip='Post a Scream!'>
								<AddIcon />
							</MyButton>
							<Link to='/'>
								<MyButton tip='Home'>
									<HomeIcon />
								</MyButton>
							</Link>
							<MyButton tip='Notifications'>
								<Notifications />
							</MyButton>
						</Fragment>
					) : (
						<Fragment>
							<Button color='inherit' component={Link} to='/'>
								Home
							</Button>
							<Button
								color='inherit'
								component={Link}
								to='/signup'
							>
								Signup
							</Button>
							<Button
								color='inherit'
								component={Link}
								to='/login'
							>
								Login
							</Button>
						</Fragment>
					)}
				</Toolbar>
			</AppBar>
		);
	}
}
Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
	authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
