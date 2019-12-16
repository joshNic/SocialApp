import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';
import Profile from '../components/Profile';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getScreams } from '../redux/actions/dataActions';
import ScreamSkeleton from '../components/ScreamSkeleton';

class Home extends Component {
	componentDidMount() {
		this.props.getScreams();
	}

	render() {
		const { screams, loading } = this.props.data;
		let recentScreamMarkup = !loading ? (
			screams.map(scream => (
				<Scream key={scream.screamId} scream={scream} />
			))
		) : (
			<ScreamSkeleton />
		);
		return (
			<Grid container spacing={10}>
				<Grid item sm={8} xs={12}>
					{recentScreamMarkup}
				</Grid>
				<Grid item sm={4} xs={12}>
					<Profile />
				</Grid>
			</Grid>
		);
	}
}
Home.propTypes = {
	getScreams: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	data: state.data
});
const mapActionsToProps = {
	getScreams
};
export default connect(mapStateToProps, mapActionsToProps)(Home);
