const API_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_SyPwAQaA7';
const APP_SECRET = '36cf04a02fd04604802375daa2169a9b';
export default {
    apiUrl: "http://localhost/api", // USE WITH LOCAL API ONLY
    surveyUrl: `${API_URL}appdata/${APP_KEY}/surveys`,
	sectionsUrl: `${API_URL}appdata/${APP_KEY}/sections`,
	questionsUrl: `${API_URL}appdata/${APP_KEY}/questions`,
	possibilitiesUrl: `${API_URL}appdata/${APP_KEY}/possibilities`
    
}
