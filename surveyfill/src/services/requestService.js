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

    function makeRequest(method, module, endpoint, auth, syncRequest) {
    	if(!syncRequest){
    		syncRequest = false;
    	}
        return {
            method,
            async: syncRequest,
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            headers: {
                'Authorization': makeAuth(auth)
            }
        };
    }

    function get (module, endpoint, auth, syncRequest) {
        return $.ajax(makeRequest('GET', module, endpoint, auth, syncRequest));
    }

    function post (module, endpoint, auth, data, syncRequest) {
        let req = makeRequest('POST', module, endpoint, auth, syncRequest);
        req.data = data;
        return $.ajax(req);
    }

    function update (module, endpoint, auth, data, syncRequest) {
        let req = makeRequest('PUT', module, endpoint, auth, syncRequest);
        req.data = data;
        return $.ajax(req);
    }

    function remove (module, endpoint, auth, syncRequest) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth, syncRequest));
    }
    
    let requestService = {
            get,
            post,
            update,
            remove
        }

export default requestService;
