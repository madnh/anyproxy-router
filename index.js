const URL = require('url').URL;
const Route = require('./Route');
const ROUTES = {
    _uniqueID: 0
};


const { filterFields, getUrlDetail } = require('./helpers');


function getRoutes(requestDetail) {
    const urlDetail = filterFields(getUrlDetail(new URL(requestDetail.url)));

    urlDetail.method = requestDetail.requestOptions.method.toLowerCase();

    const resultRoutes = [];

    // console.log('---- URL detail ----');
    // console.log(urlDetail);

    for (let key in ROUTES) {
        if (!ROUTES.hasOwnProperty(key) || key[0] === '_')
            continue;

        let detail;

        /**
         * @type Route
         */
        let route;

        if (!ROUTES[key]._route) {
            try {
                detail = JSON.parse(key);
                delete detail._id; // Route ID
            } catch (e) {
                detail = { hostname: key };
            }

            ROUTES[key]._route = new Route(detail);
        }

        route = ROUTES[key]._route;

        if (route.isMatch(urlDetail)) {
            resultRoutes.push({
                route,
                key
            });
        }
    }

    return resultRoutes;
}

function toArray(args) {
    if (!(args instanceof Array))
        return Array.prototype.slice.call(args);

    return args;
}

function handleRoute(key, route, actionName, args, stopOnFirstResult) {
    let actions = ROUTES[key] && ROUTES[key][actionName] || null;

    if (!actions)
        return null;

    if (!(actions instanceof Array))
        actions = [actions];

    args = toArray(args);
    for (const action of actions) {
        const actionResult = action.apply(action, args);

        if (
            typeof actionResult !== 'undefined'
            && actionResult !== null
            && stopOnFirstResult
        ) {

            return actionResult;
        }
    }

    return null;
}

function handle(actionName, args, stopOnFirstResult = false) {
    const requestDetail = args[0];
    let routes = getRoutes(requestDetail);

    // When not found route
    if (!routes.length) {
        console.log('--- Not found any routes');

        return null;
    }


    // Loop over actions
    for (let { key, route } of routes) {
        const routeResult = handleRoute(key, route, actionName, args, stopOnFirstResult);

        if (routeResult)
            return routeResult;
    }

    return null;
}



/**
 * @param {Route} route
 * @param {{}} detail
 */
function addRoute(route, detail) {
    if (typeof route === 'string')
        route = new Route(route);

    if (
        detail instanceof Array
        ||
        (!detail.beforeSendRequest
            && !detail.beforeSendResponse
            && !detail.onError
            && !detail.onConnectError
        )
    ) {
        detail = {
            beforeSendRequest: detail
        };
    }

    const routeKey = JSON.stringify(Object.assign(
        {},
        route.detail,
        { _id: ++ROUTES._uniqueID }
    ));

    console.log("Add route:", routeKey);

    ROUTES[routeKey] = Object.assign(
        {},
        detail,
        { _route: route }
    );

    return routeKey;
}

function router() {
    return {
        summary: 'Anyproxy Router System',

        * beforeSendRequest(requestDetail) {
            return handle('beforeSendRequest', arguments, true);
        },

        * beforeSendResponse(requestDetail, responseDetail) {
            return handle('beforeSendResponse', arguments);
        },

        * onError(requestDetail, error) {
            return handle('onError', arguments);
        },

        * onConnectError(requestDetail, error) {
            handle('onConnectError', arguments);
        },
    };
}

module.exports = {
    addRoute,
    router
}