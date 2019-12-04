import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

class Home extends Component {
	state = {
		screams: null
	};
	componentDidMount() {
		axios
			.get('/screams')
			.then(res => {
				console.log(res.data);
				this.setState({ screams: res.data });
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		let recentScreamMarkup = this.state.screams ? (
			this.state.screams.map(scream => <p>{scream.body}</p>)
		) : (
			<p>Loading</p>
		);
		return (
			<Grid container>
				<Grid item sm={8} xs={12}>
					{recentScreamMarkup}
				</Grid>
				<Grid item sm={4} xs={12}>
					<p>profile....</p>
				</Grid>
			</Grid>
		);
	}
}
export default Home;
