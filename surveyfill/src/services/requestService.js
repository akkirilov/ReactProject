import $ from 'jquery'

const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_SyPwAQaA7';
const APP_SECRET = '36cf04a02fd04604802375daa2169a9b';

    function makeAuth(authtoken) {
    	if (!authtoken || authtoken.toLowerCase() === 'basic') {
    		return 'Basic ' + btoa(APP_KEY + ':' + APP_SECRET);
		} else {
			return 'Kinvey ' + authtoken;
		}
    }

    function makeRequest(method, module, endpoint, auth) {
        return {
            method,
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            headers: {
                'Authorization': makeAuth(auth)
            }
        };
    }

    function get (module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth));
    }

    function post (module, endpoint, auth, data) {
        let req = makeRequest('POST', module, endpoint, auth);
        req.data = data;
        return $.ajax(req);
    }

    function update (module, endpoint, auth, data) {
        let req = makeRequest('PUT', module, endpoint, auth);
        req.data = data;
        return $.ajax(req);
    }

    function remove (module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }
    
    let requestService = {
            get,
            post,
            update,
            remove
        }

export default requestService;
