routes = function(app, UniqushController) {
	app.post('/add', function(req, res) {
		return UniqushController.addProvider(req, res);
	});
	app.post('/remove', function(req, res) {
		return UniqushController.removeProvider(req, res);
	});
	app.post('/subscribe', function(req, res) {
		return UniqushController.subscribe(req, res);
	});
	app.post('/unsubscribe', function(req, res) {
		return UniqushController.unsubscribe(req, res);
	});
	app.post('/push', function(req, res) {
		return UniqushController.push(req, res);
	});
};

module.exports = routes;