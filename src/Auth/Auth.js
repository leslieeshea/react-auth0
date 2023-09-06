import auth0 from 'auth0-js';

class Auth {
	constructor(history) {
		this.history = history;
		this.auth0 = new auth0.WebAuth({
			domain: process.env.REACT_APP_AUTH0_DOMAIN,
			clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
			redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
			responseType: "token id_token",
			scope: "openid profile email"
		});
	}

	login = () => {
		this.auth0.authorize();
	}
}

export default Auth;