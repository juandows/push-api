var express = require('express');
var config = require('./config/config');

var push_api_port = config.push_api_port; 
 
var app = express();
//Middlewares
app.use(express.bodyParser());
app.use(function (req, res, next) {
	//Allow Openfire (http and https)
	if(config.access_control_allowed && (req.headers['origin'] == config.access_control_allow_origin || req.headers['origin'] == config.access_control_allow_origin_ssl)){
    	res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
	}
  next();
});

var uniqushController = require('./app/controllers/uniqushController');

require('./app/routes.js')(app, uniqushController);

app.listen(push_api_port);
console.log('PushApi listening on port ' + push_api_port + '...');