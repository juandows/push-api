var querystring = require('querystring');  
var http = require('http');
var events = require('events');
var config = require('../../config/config');

var Controller = require('./controller');

var UniqushController = new Controller();

UniqushController.addProvider = function(req, res){
	var json = req.body;
	var os = json.os;
	var service = json.service;
	//Android
	var projectid = json.projectid;
	var apikey = json.apikey;
	//iOS
	var cert = json.cert;
	var key = json.key;
	var sandbox = json.sandbox;

	//Check parameters
	if (os == undefined || (os != "ANDROID" && os != "IOS") || service == undefined
		|| (os == "ANDROID" && (projectid == undefined || apikey == undefined)) 
		|| (os == "IOS" && (cert == undefined || key == undefined)) ){
		res.send(400, 'Missing parameters');
		return;
	}

	var parameters = {
		"service": service
	}

	var pushType = "";
	if(os == "ANDROID"){
		pushType = "gcm";
		parameters.projectid = projectid;
		parameters.apikey = apikey;
	}else if(os == "IOS"){
		pushType = "apns";
		parameters.cert = cert;
		parameters.key = key;
		if(sandbox){
			parameters.sandbox = sandbox;
		}
	}
	parameters.pushservicetype = pushType;

	var emitter = new events.EventEmitter;
	sendToUniqush("/addpsp", parameters, emitter, "push-response-received");
	emitter.on('push-response-received', function(resul) {
		res.send(resul);
	});	
}

UniqushController.removeProvider = function(req, res){
	var json = req.body;
	var os = json.os;
	var service = json.service;
	//Android
	var projectid = json.projectid;
	var apikey = json.apikey;
	//iOS
	var cert = json.cert;
	var key = json.key;

	//Check parameters
	if (os == undefined || (os != "ANDROID" && os != "IOS") || service == undefined
		|| (os == "ANDROID" && (projectid == undefined || apikey == undefined)) 
		|| (os == "IOS" && (cert == undefined || key == undefined)) ){
		res.send(400, 'Missing parameters');
		return;
	}

	var parameters = {
		"service": service
	}

	var pushType = "";
	if(os == "ANDROID"){
		pushType = "gcm";
		parameters.projectid = projectid;
		parameters.apikey = apikey;
	}else if(os == "IOS"){
		pushType = "apns";
		parameters.cert = cert;
		parameters.key = key;
	}
	parameters.pushservicetype = pushType;

	var emitter = new events.EventEmitter;
	sendToUniqush("/rmpsp", parameters, emitter, "push-response-received");
	emitter.on('push-response-received', function(resul) { 
		res.send(resul);
	});	
}

UniqushController.subscribe = function (req, res){
	var json = req.body;
	var os = json.os;
	var service = json.service;
	var user = json.user;
	var regID = json.token;
	var device = json.device;

	if (os == undefined || (os != "ANDROID" && os != "IOS") || service == undefined 
		|| user == undefined || regID == undefined){
		res.send(400, 'Missing parameters');
		return;
	}

	var parameters = {
		"service": service
	}

	var pushType = '';
	if(os == 'ANDROID'){
		pushType = 'gcm';
		parameters.regid = regID;
	}else if(os == 'IOS'){
		if(device == "iPad"){
            pushType = 'apns-ipad';
        }else{
            pushType = 'apns';
        }
		parameters.devtoken = regID;
	}
	parameters.subscriber = user;
	parameters.pushservicetype = pushType;

	var emitter = new events.EventEmitter;
	sendToUniqush("/subscribe", parameters, emitter, "push-response-received");
	emitter.on('push-response-received', function(resul) { 
		res.send(resul);
	});
}

UniqushController.unsubscribe = function (req, res){
	var json = req.body;
  var os = json.os;
  var service = json.service;
  var user = json.user;
  var regID = json.token;
	var device = json.device;

	if (os == undefined || (os != "ANDROID" && os != "IOS") || service == undefined 
		|| user == undefined || regID == undefined){
        res.send(400, 'Missing parameters');
		return;
    }

	var parameters = {
		"service": service
	}

	var pushType = '';
	if(os == 'ANDROID'){
		pushType = 'gcm';
		parameters.regid = regID;
	}else if(os == 'IOS'){
		if(device == "iPad"){
            pushType = 'apns-ipad';
        }else{
            pushType = 'apns';
        }
		parameters.devtoken = regID;
	}
	parameters.subscriber = user;
	parameters.pushservicetype = pushType;

	var emitter = new events.EventEmitter;
	sendToUniqush("/unsubscribe", parameters, emitter, "push-response-received");
	emitter.on('push-response-received', function(resul) { 
		res.send(resul);
	});
}

UniqushController.push = function (req, res){
	var json = req.body;

	var parameters = {}
  for(var k in json){
  	if(json[k] != undefined){
			parameters[k] = json[k];
  	}
  }

	if (parameters.service == undefined || parameters.subscriber == undefined 
		|| parameters.msg == undefined){
    res.send(400, 'Missing parameters');
		return;
  }

	var emitter = new events.EventEmitter;
	sendToUniqush("/push", parameters, emitter, "push-response-received");
	emitter.on('push-response-received', function(resul) { 
		res.send(resul);
	});
}

function sendToUniqush(path, parameters, emitter, emitter_key){
	var post_data = "";
	var cont = 0;
	var size = Object.keys(parameters).length;
	for (var key in parameters){
		var param = parameters[key];
		if(cont < size-1){
			post_data += key + "=" + param + "&";
		}else{
			post_data += key + "=" + param;
		}
		cont++;
	};

	var post_options = {
		host: config.uniqush.host,
		port: config.uniqush.port,
		path: path,
		method: "POST",
		headers: {  
			'Content-Type': 'application/x-www-form-urlencoded',  
			'Content-Length': post_data.length  
		} 
	};

	var post_req = http.request(post_options, function(res){
		res.setEncoding('utf8');
		res.on('data', function (chunk){
			console.log("Response: " + chunk);
			emitter.emit(emitter_key, chunk);
		});
	});

	post_req.write(post_data);
	post_req.end();
}

module.exports = UniqushController;