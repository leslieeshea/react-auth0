const express = require('express');
require('dotenv').config();

const app = express();

app.get('/public', function(request, response) {
	response.json({
		message: 'Hello from a public API!'
	});
});

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_API_URL);
