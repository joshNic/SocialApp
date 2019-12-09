import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';
import DialogActions from '@material-ui/core/DialogActions';
import MyButton from '../util/MyButton';

const styles = theme => ({
	...theme.custom,
	button: {
		float: 'right'
	}
});

class EditProfile extends Component {
	state = {
		bio: '',
		website: '',
		location: '',
		open: false
	};
	mapUserDetailsToState = credentials => {
		this.setState({
			bio: credentials.bio ? credentials.bio : '',
			website: credentials.website ? credentials.website : '',
			location: credentials.location ? credentials.location : ''
		});
	};
	handleOpen = () => {
		this.setState({ open: true });
		this.mapUserDetailsToState(this.props.credentials);
	};
	handleClose = () => {
		this.setState({ open: false });
	};
	componentDidMount() {
		const { credentials } = this.props;
		this.mapUserDetailsToState(credentials);
	}

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	handleSubmit = () => {
		const userDetails = {
			bio: this.state.bio,
			website: this.state.website,
			location: this.state.location
		};
		this.props.editUserDetails(userDetails);
		this.handleClose();
	};
	render() {
		const { classes } = this.props;
		return (
			<Fragment>
				<MyButton
					tip='Edit Details'
					onClick={this.handleOpen}
					btnClassName={classes.button}
				>
					<EditIcon color='primary' />
				</MyButton>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth='sm'
				>
					<DialogTitle>Edit your details</DialogTitle>
					<DialogContent>
						<form>
							<TextField
								name='bio'
								tpye='text'
								label='Bio'
								multiline
								rows='3'
								placeholder='A short bio about yourself'
								className={classes.textField}
								value={this.state.bio}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='website'
								tpye='text'
								label='Website'
								placeholder='Your personal/professinal website'
								className={classes.textField}
								value={this.state.website}
								onChange={this.handleChange}
								fullWidth
							/>
							<TextField
								name='location'
								tpye='text'
								label='Location'
								placeholder='Where you live'
								className={classes.textField}
								value={this.state.location}
								onChange={this.handleChange}
								fullWidth
							/>
						</form>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color='primary'>
							Cancel
						</Button>
						<Button onClick={this.handleSubmit} color='primary'>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

EditProfile.propTypes = {
	editUserDetails: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(
	withStyles(styles)(EditProfile)
);
