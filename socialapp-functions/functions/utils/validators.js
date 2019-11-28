const isEmail = email => {
	const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (email.match(regEx)) {
		return true;
	} else {
		return false;
	}
};

const isEmpty = entry => {
	if (entry.trim() === '') {
		return true;
	} else {
		return false;
	}
};

exports.validateSignupData = data => {
	let errors = {};

	if (isEmpty(data.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(newUser.email)) {
		errors.email = 'Must be a valid email address';
	}

	if (isEmpty(data.password)) errors.password = 'Must not be empty';
	if (data.password !== data.confirmPassword)
		errors.confirmPassword = 'Passwords must match';
	if (isEmpty(data.handle)) errors.handle = 'Must not be empty';
	// if (Object.keys(errors).length > 0) return res.status(400).json(errors);

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};

exports.validateLoginData = data => {
	let errors = {};

	if (isEmpty(data.email)) errors.email = 'Must not be empty';
	if (isEmpty(data.password)) errors.password = 'Must not be empty';
	// if (Object.keys(errors).length > 0) return res.status(400).json(errors);
	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};
