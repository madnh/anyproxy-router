const {addRoute, router} = require("anyproxy-router");

// Load Routes
//--------------------------------

require('./routes/all.routes.js.js')(addRoute);

// other routes here


module.exports = router();
