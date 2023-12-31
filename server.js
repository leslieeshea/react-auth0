const express = require('express');
require('dotenv').config();
const jwt = require('express-jwt'); // Validate JWT and set request.user
const jwksRsa = require('jwks-rsa'); // Retrieve RSA keys from a JSON web key set (JWKS) endpoint
const checkScope = require('express-jwt-authz'); // Validate JWT scopes

const checkJwt = jwt({
	// Dynamically provide a signing key based on the kid in the header
	// and the signing keys provided by the JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true, // cache the signing key
		rateLimit: true,
		jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
		jwksUri: `https://${
		process.env.REACT_APP_AUTH0_DOMAIN
		}/.well-known/jwks.json`
	}),

	// Validate the audience and the issuer.
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

	// This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
	algorithms: ["RS256"]
});

const app = express();

app.get('/public', function(request, response) {
	response.json({
		message: 'Hello from a public API!'
	});
});

app.get('/private', checkJwt, function(request, response) {
	response.json({
		message: 'Hello from a private API!'
	});
});

function checkRole(role) {
	return function (request, response, next) {
		const assignedRoles = request.user["http://localhost:3000/roles"];

		if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
			return next();
		} else {
			return response.status(401).send("Insufficient role");
		}
	}
}

app.get('/course', checkJwt, checkScope(["read:courses"]), function(request, response) {
	response.json({
		courses: [
			{
				id: 1,
				title: "Building Apps with React and Redux"
			},
			{
				id: 2,
				title: "Creating Reusable React Components"
			}
		]
	});
});

app.get('/admin', checkJwt, checkRole('admin'), function(request, response) {
	response.json({
		message: 'Hello from an Admin API!'
	});
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_API_URL);
