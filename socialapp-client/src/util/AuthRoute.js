import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ componet: Component, authenticated, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			authenticated === true ? (
				<Redirect to='/' />
			) : (
				<Component {...props} />
			)
		}
	/>
);
export default AuthRoute;
