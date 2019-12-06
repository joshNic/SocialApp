import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/logo.png';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = theme => ({
	...theme.custom
});

class Login extends Component {
	state = {
		email: '',
		password: '',
		loading: false,
		errors: {}
	};
	// constructor(){
	//   super()
	//   this.state
	// }
	// UNSAFE_componentWillReceiveProps(nextProps) {
	// 	if (nextProps.UI.errors) {
	// 		this.setState({ errors: nextProps.UI.errors });
	// 	}
	// }
	// static static getDerivedStateFromProps(prevProps, prevState) {
	//   if(prevProps.UI.errors !==prevState.UI.errors){
	//     return {errors:prevProps.UI.errors}
	//   }

	// }
	handleSubmit = event => {
		event.preventDefault();
		this.setState({
			loading: true
		});
		const userData = {
			email: this.state.email,
			password: this.state.password
		};
		this.props.loginUser(userData, this.props.history);
	};
	handleChange = event => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	render() {
		// console.log('propssss', this.props);
		const {
			classes,
			UI: { loading }
		} = this.props;
		const { errors } = this.state;
		return (
			<Grid container className={classes.form}>
				<Grid item sm />
				<Grid item sm>
					<img src={AppIcon} alt='logo' className={classes.image} />
					<Typography variant='h1' className={classes.pageTitle}>
						Login
					</Typography>
					<form noValidate onSubmit={this.handleSubmit}>
						<TextField
							id='email'
							name='email'
							type='email'
							label='Email'
							className={classes.textField}
							helperText={errors.email}
							error={errors.email ? true : false}
							value={this.state.email}
							onChange={this.handleChange}
							fullWidth
						/>
						<TextField
							id='password'
							name='password'
							type='password'
							label='Password'
							className={classes.textField}
							helperText={errors.password}
							error={errors.password ? true : false}
							value={this.state.password}
							onChange={this.handleChange}
							fullWidth
						/>
						{errors.general && (
							<Typography
								variant='body2'
								className={classes.customError}
							>
								{errors.general}
							</Typography>
						)}
						<Button
							type='submit'
							variant='contained'
							color='primary'
							disabled={loading}
							className={classes.button}
						>
							Login
							{loading && (
								<CircularProgress
									size={20}
									className={classes.progress}
								/>
							)}
						</Button>
						<br />
						<small className={classes.link}>
							dont have an account ? sign up
							<Link to='/signup'>here</Link>
						</small>
					</form>
				</Grid>
				<Grid item sm />
			</Grid>
		);
	}
}
Login.propTypes = {
	classes: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	user: state.user,
	UI: state.UI
});

const mapActionsToProps = {
	loginUser
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(withStyles(styles)(Login));
