// We will declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const CommonUtils = require('./utils/CommonUtils');
const RegistrationControler = require('./controllers/registration');
const UserController = require('./controllers/user');
const SearchController = require('./controllers/search');
const AuthController = require('./controllers/authorization');
const jwt = require('jsonwebtoken');


//Declaring Port
const port = 3000;

//Initialize our app variable
const app = express();

//Middleware for CORS
app.use(cors());

//Middlewares for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//authorization
app.set('superSecret', CommonUtils.appSecret);


/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
	res.send("Invalid pagee");
});



//middleware  
app.use(function (req, res, next) {
	if (CommonUtils.allowAnonimous(req)) {
		//TODO check if authorized already to redirect 
		if (CommonUtils.getToken(req)){
			//Token exists but we are on anonimous page
			return res.status(403).send({
				success: false,
				message: 'User Already Signed In!'
			});
		}else{
			//permit go to page;
			next();
		}
	} else {
		// check header or url parameters or post parameters for token  
		var token = CommonUtils.getToken(req);
		// decode token  
		if (token) {z
			// verifies secret and checks exp
			var secret = new Buffer(app.get('superSecret'), 'base64');
			jwt.verify(token, secret, function (err, decoded) {
				if (err) {
					console.log(err);
					return res.json({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes  
					req.decoded = decoded;
					next();
				}
			});
		} else {
			// if there is no token  
			// return an error  
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	}
});


//Routing all HTTP requests to /bucketlist to bucketlist controller
app.use('/api/registration', RegistrationControler);
app.use('/api/user', UserController);
app.use('/api/search', SearchController);
app.use('/api/auth', AuthController);



//Listen to port 3000
app.listen(port, () => {
	console.log(`Starting the server at port ${port}`);
});