import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/Scream';
import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import StaticProfile from '../components/StaticProfile';
import ScreamSkeleton from '../components/ScreamSkeleton';
import ProfileSkeleton from '../components/ProfileSkeleton';

class User extends Component {
	state = {
		profile: null,
		screamIdParam: null
	};
	componentDidMount() {
		const handle = this.props.match.params.handle;
		const screamId = this.props.match.params.screamId;

		if (screamId) this.setState({ screamIdParam: screamId });

		this.props.getUserData(handle);
		axios
			.get(`/user/${handle}`)
			.then(res => {
				this.setState({
					profile: res.data.user
				});
			})
			.catch(err => console.log(err));
	}
	render() {
		console.log('this is props', this.props);
		const { screams, loading } = this.props.data;
		const screamsMarkup = loading ? (
			<ScreamSkeleton />
		) : screams === null ? (
			<p>No screams from this user</p>
		) : (
			screams.map(scream => (
				<Scream key={scream.screamId} scream={scream} />
			))
		);

		return (
			<Grid container spacing={10}>
				<Grid item sm={8} xs={12}>
					{screamsMarkup}
				</Grid>
				<Grid item sm={4} xs={12}>
					{this.state.profile === null ? (
						<ProfileSkeleton />
					) : (
						<StaticProfile profile={this.state.profile} />
					)}
				</Grid>
			</Grid>
		);
	}
}

User.propTypes = {
	getUserData: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	data: state.data
});

export default connect(mapStateToProps, { getUserData })(User);
