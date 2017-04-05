(function (angular, undefined) { 'use strict';

angular.module('ng-auth', []);

// Define auth configuration
var settings = {
	redirecting: false, // Help with not trying to renew token when redirect is about to happen
	content_urls: [],
	popup: false,
	scope: [],
	options: {},
	auto_auth: true,
	response_type: 'token',
	path_delimiter: '#'
},

tokenRefreshReduction = (60 * 1000 * 5), // 5 minutes

AUTH_SESSION_STORAGE_KEY = 'ng-auth';

// save a code
function saveCode(code, $window) {
	$window.localStorage[AUTH_SESSION_STORAGE_KEY + '-' + settings.client_id + '-code'] = angular.toJson(code);
	return code;
}

// Save a token when it is found
function saveToken(token, $window) {
	// Save to session storage
	var now = Date.now();

	if (token.refresh_token) {
		saveCode({code: token.refresh_token}, $window);
	}

	token.expires_at = token.expires_at || (now + (token.expires_in * 1000) - tokenRefreshReduction);
	$window.sessionStorage[AUTH_SESSION_STORAGE_KEY + '-' + settings.client_id + '-token'] = angular.toJson(token);
	return token;
}

function buildTokenUrl(config, code, $location) {
	var copy = angular.copy(config);
	var url = copy.token_url;

	url += '?client_id=' + copy.client_id;
	url += '&code=' + code.code;
	url += '&grant_type=authorization_code';
	url += '&redirect_uri=' + (copy.redirect_uri === true ? $location.absUrl().split('#')[0].split('?')[0] : copy.redirect_uri);

	return url;
}

// Using the config, build the auth redirect url
function buildUrl(config, $location, $window) {

	var configCopy = angular.copy(config);
	var url = configCopy.oauth2_url + '?';
	var state = $location.url();
	var redirect = $location.absUrl().split('#')[0].split('?')[0];

	if ($location.$$html5) {
		$window.localStorage.authPath = $location.$$path;
		redirect = $location.protocol() + '://' + $location.host();
		if (redirect.indexOf('localhost') !== -1) {
			redirect += ':' + $location.port();
		}
		redirect += '/';
	}

	// Add clientId
	url += 'client_id=' + configCopy.client_id;

	// Add scopes
	url = configCopy.scope.length ?
		url + '&scope=' + configCopy.scope.join(' ').replace(/\s/g, '%20') :
		url;

	// Add state
	// If config is true, set to current location
	// otherwise set to the string they passed or nothing
	url = configCopy.state === true ?
		url + '&state=' + encodeURIComponent(state) :
		angular.isString(configCopy.state) ?
			url + '&state=' + encodeURIComponent(configCopy.state) :
			url;

	// Add response type (force token for now)
	url += '&response_type=' + (configCopy.response_type || settings.response_type);

	// Add redirectUri
	url = configCopy.redirect_uri === true ?
		url + '&redirect_uri=' + redirect :
		url + '&redirect_uri=' + configCopy.redirect_uri;

	// Add additional non-standard query params
	angular.forEach(configCopy.options, function (value, key) {
		url += '&' + key + '=' + value;
	});

	return url;
}

// Remove auth info from url
// TODO Does this work in html5 mode?
var tokenRegex = /([^&=]+)=([^&]*)/g;
function stripToken(path, delimiter) {

	var params = {}, queryString = '', m;
	var pathChunks = path.split(delimiter || '#');

	if (pathChunks.length > 1) {

		if (pathChunks[1].charAt(0) === '/') { // if hash was found, this shouldnt be undefined
			pathChunks[1] = pathChunks[1].substring(1);
		}

		queryString = pathChunks[1];
		while ((m = tokenRegex.exec(queryString))) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);// save out each query param
		}
	}

	params.hash = pathChunks[2];

	if (params.hash === undefined) delete params.hash;

	return params;
}

// Check url against protected urls
function urlRequiresAuth(url, settings) {

	var protect = false;
	angular.forEach(settings.content_urls, function (prefix) {
		if (url.indexOf(prefix) === 0) {
			protect = true;
		}
	});
	return protect;
}

// Configure function
function configure (config) {

	// We need to blow up somewhere else if these are bad values
	// This allows multiple calls to configure

	// Set state param in oauth2 to match the angular route
	settings.state = config.state || settings.state;

	// Set redirect uri to the current location
	// WARNING: Allows flexibility in development, but still must be registered as valid redirect uri on auth server
	settings.redirect_uri = config.redirectUri || settings.redirect_uri;

	// Response type (defaults to token)
	settings.response_type = config.responseType || settings.response_type;

	// Path delimiter (some oauth providers put token or code after a #, or ? tells ng-auth where to look)
	settings.path_delimiter = config.pathDelimiter || settings.path_delimiter;

	// URLs to check for authentication on
	if (angular.isArray(config.contentUrls)) {
		angular.forEach(config.contentUrls, function (url) {
			if (settings.content_urls.indexOf(url) === -1) settings.content_urls.push(url);
		});
	}

	// Whether to login with popup or redirect
	settings.popup = config.popup || settings.popup;

	// Set scopes
	if (angular.isArray(config.scope)) {
		angular.forEach(config.scope, function (s) {
			if (settings.scope.indexOf(s) === -1) settings.scope.push(s);
		});
	}

	// ClientID and OAuth2 url
	settings.oauth2_url = config.oauth2Url || settings.oauth2_url;
	settings.token_url = config.tokenUrl;
	settings.client_id = config.clientId || settings.client_id;
	settings.client_secret = config.clientSecret;

	// Query param options
	settings.options = angular.extend({}, settings.options, (config.options || {}));

	// Auto-auth
	settings.auto_auth = config.autoAuth == null ? settings.auto_auth : config.autoAuth;
}

// Run-time service
function oauth2Service($injector, $q, $location, $window) {

	var foundOnPath = false;
	function findToken() {

		// If user added oauth attribute to body, we remove it once authentication is complete
		function showBody() {
			angular.element($window.document).find('body').removeAttr('oauth-hide');
		}

		// Throw error for missing required pieces
		if (!settings.client_id || !settings.redirect_uri || !settings.oauth2_url) {
			throw new Error('Missing required configuration options');
		}

		// Try to find access token on path
		var token = stripToken($window.location.href, settings.path_delimiter);
		if (token.access_token && token.expires_in) {
			foundOnPath = true;
			saveToken(token, $window);
			showBody();
			if (token.state) {

				var pieces = token.state.split('?');

				// Set path
				$location.path(pieces[0]);

				// Set query
				$location.search(stripToken(pieces.slice(1).length ? '#' + pieces.slice(1)[0] : ''));

				// Set hash
				var hash = token.hash;
				if (hash && hash !== 'undefined') {
					$location.hash(hash);
				}

			} else if (~$location.hash().indexOf('/access_token')) {
				$location.hash(''); // Clear hash if we aren't using routing or state
			}

			return;
		} else if (token.code) {
			// handle code flow
			// 1. save code in local storage
			saveCode(token, $window);
			// 2. Get an access token
			service.getTokenFromCode(token)
			.then(function (accessToken) {
				foundOnPath = true;
				saveToken(accessToken, $window);
				showBody();
				$location.search('');
				var path = $window.localStorage.authPath;
				if (path) {
					$location.path(path);
					delete $window.localStorage.authPath;
				}
			});

			return;
		}

		// If we were logged in, but have an expired token, re-authenticate
		if (!service.isAuthenticated() && angular.isObject(service.getToken())) {
			service.authenticate();
			return;
		}

		// See if a login has occurred before forcing authentication
		// If we are authenticated, we are good
		if (service.isAuthenticated()) {
			showBody();
			return;
		}

		// Try to authenticate
		if (settings.auto_auth) {
			service.authenticate();
		}
	}

	// Configure the service
	var service = {};

	// Register a function to call when authentication occurs
	service.registerCallback = function (func) {
		return !foundOnPath || func();
	};

	service.authenticate = function () {
		// Start Oauth2 flow
		var url = buildUrl(settings, $location, $window);

		// TODO: Popup style
		$window.location.href = url;
		settings.redirecting = true;
	};

	// Access to modify config later
	service.lateConfig = configure;

	service.isAuthenticated = function () {
		// Verify user is authenticated
		var token = service.getToken();
		var now = new Date().getTime();
		var valid = (angular.isDefined(token) && parseInt(token.expires_at) > now);

		if (valid) {
			saveToken(token, $window);
		}

		return valid;
	};

	service.wasAuthenticated = function () {
		// Were you ever logged in?
		var token = service.getToken();

		if (!token) {
			return false;
		}

		return true;
	};

	service.getTokenFromCode = function (code) {

		var defer = $q.defer();

		fetch(buildTokenUrl(settings, code, $location), {
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		}).then(function (response) {
			return response.json();
		}).then(function (json) {
			if (angular.isObject(json) && !json.error) {
				defer.resolve(saveToken(json, $window));
				return;
			}

			defer.reject('Token was not received as JSON');
		}).catch(function () {
			defer.reject('Something bad happened');
		});

		return defer.promise;
	};

	service.updateToken = function () {

		var defer = $q.defer();

		// Try async authentication
		$injector.get('$http')({
			url: buildUrl(settings, $location, $window),
			method: 'GET',
			withCredentials: true,
			headers: {
				Accept: 'application/json'
			}
		})
		.success(function (data) {
			if (angular.isObject(data)) {
				defer.resolve(saveToken(data, $window));
				return;
			}

			defer.reject('Token was not received as JSON');
		})
		.error(function () {
			// Authenticate normally
			console.warn('Attempted to retrieve token async, fallback to default method');
			defer.reject('Couldn\'t get token, re-authenticate');
			service.authenticate();
		});

		return defer.promise;
	};

	service.getConfig = function () {
		return angular.copy(settings);
	};

	service.getToken = function () {
		return angular.fromJson($window.sessionStorage[AUTH_SESSION_STORAGE_KEY + '-' + settings.client_id + '-token']);
	};

	service.getCode = function () {
		return angular.fromJson($window.localStorage[AUTH_SESSION_STORAGE_KEY + '-' + settings.client_id + '-code']);
	};

	// Kick off auth by calling function and configure auto token refresh
	findToken();

	return service;
}

function oauth2($provide, $httpProvider) {
	// Set up interceptor
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$provide.factory('authInterceptor', ['$oauth2', '$q', '$window', '$timeout', function ($oauth2, $q, $window, $timeout) {

		var waitTimeIncrease = 2;
		var maxWait = 2000;
		function wait (request, defer, waitTime) {

			// cancel if we are waiting too long
			if (waitTime > maxWait) {
				defer.reject(request);
			}

			$timeout(function () {
				if ($oauth2.isAuthenticated()) {
					defer.resolve(request);
				} else {
					wait(request, defer, waitTime * waitTimeIncrease);
				}
			}, waitTime);
		}

		function waitForAuth (request) {
			var defer = $q.defer();
			wait(request, defer, 10);
			return defer.promise;
		}

		return {
			request: function (config) {
				// Ignore requests not going to api urls
				if (urlRequiresAuth(config.url, settings)) {

					// Add token
					if ($oauth2.isAuthenticated()) {
						config.headers.Authorization = 'Bearer ' + $oauth2.getToken().access_token;
						return config;

					// Get new token async
					} else if (!$oauth2.isAuthenticated() &&
					$oauth2.wasAuthenticated() && !settings.redirecting) {
						return (settings.response_type && settings.response_type === 'code' ?
							$oauth2.getTokenFromCode($oauth2.getCode()) : $oauth2.updateToken()).then(function gotToken(token) {
							config.headers.Authorization = 'Bearer ' + token.access_token;
							saveToken(token, $window);
							return $q.when(config);
						}, function failedToGetToken() {
							return $q.reject('Invalid token cant be used for request');
						});

					// return a promise that resolves with config when $oauth2.isAuthenticated is true again
					} else {
						return waitForAuth(config);
					}
				}

				return config;
			}
		};
	}]);

	$httpProvider.interceptors.push('authInterceptor');
}

oauth2.prototype.$get = ['$injector', '$q', '$location', '$window', oauth2Service];

// Configure the OAuth2 object
oauth2.prototype.configure = configure;

angular.module('ng-auth').provider('$oauth2', ['$provide', '$httpProvider', oauth2]);
angular.module('ng-auth').constant('oauth2-key', AUTH_SESSION_STORAGE_KEY);

})(angular);
