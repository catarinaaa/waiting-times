const functions = require("firebase-functions");
const express = require('express');
const https = require('https');
const cors = require('cors');
const config = require('./config.js');
const axios = require('axios');

const app = express();

app.use(cors({origin: true}));
app.options('*', cors());

app.use(express.urlencoded({
    extended: true
}));

//app.listen(process.env.PORT || 3000, () => console.log("Server available on http://localhost:3000"))

/**
 * Endpoint for requesting waiting times
 */
app.get('/metro', (request, response) => {
    requestToken().then((token) => {
        console.log(token);
        storeStationCodes(token).then((stationCodes) => {
            storeDestinationCodes(token).then((destinationCodes) => {
                var optionsMetro = {
                    url: `https://api.metrolisboa.pt:8243/estadoServicoML/1.0.1/tempoEspera/Estacao/${stationCodes.get(request.query.station)}`,
                    host: 'api.metrolisboa.pt',
                    port: '8243',
                    path: `/estadoServicoML/1.0.1/tempoEspera/Estacao/${stationCodes.get(request.query.station)}`,
                    method: 'GET',
                    headers : { 'Authorization' : `Bearer ${token}`,
                    'accept': 'application/json'}
                }
                const destination = destinationCodes.get(request.query.destination);
                let result = null;
                doRequest(optionsMetro).then((data) => {
                    if(data.codigo == "200") {
                        for(const el in data.resposta) {
                            if(data.resposta[el].hasOwnProperty('destino')) {
                                if(data.resposta[el].destino == destinationCodes.get(request.query.destination)) {
                                    result = data.resposta[el];
                                    response.send(data.resposta[el]); 
                                    return;
                                }
                            }
                        }
            
                    }
                    response.send(result); 
            });
        });
    });
});
});

/**
 * Endpoints to retrieve full information 
 */
app.get('/info', (request, response) => { 
    requestToken().then((token) => {
        var options = {
            host: 'api.metrolisboa.pt',
            port: '8243',
            path: '/estadoServicoML/1.0.1/infoEstacao/todos',
            method: 'GET',
            headers : { 'Authorization' : `Bearer ${token}`,
            'accept': 'application/json'}
        }

        doRequest(options).then((data) => {response.send(data);});
    });
});


/**
 * Do a get request with options provided
 *
 * @param {Object} options
 * @return {Promise} a promise of request
 * @return {String} response JSON
 */
function doRequest(options) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let responseBody = '';
        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            resolve(JSON.parse(responseBody));
        });
        });

        req.on('error', (err) => {
            reject(err);
        });
        
        if(options.method == 'POST')
            req.write('grant_type=client_credentials');
        req.end();
    });
}

/**
 * TODO: Handles errors
 */
function processError(err) {
    console.error("ERROR: " + err);
}

/**
 * Requests API access token
 * @return {Promise} a promise of request
 * @return {String} token
 */
function requestToken() {
    return new Promise((resolve, reject) => {
        var tokenOptions = {
            url: `https://api.metrolisboa.pt:8243/token` ,
            host: 'api.metrolisboa.pt',
            port: '8243',
            path: '/token',
            method: 'POST',
            headers : { 'Authorization' : `Basic ${config.BASE64_SECRET}`,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let token = '';
        doRequest(tokenOptions)
        .then((data) => {
            token = data.access_token; 
            resolve(token);
        });
    })
}


/**
 * Returns stations codes
 * @param {String} token for API request
 * @return {Promise} a promise of request
 * @return {Map} maps key station name to its code
 */
function storeStationCodes(token) {
    return new Promise((resolve, reject) => {
        const stationCodes = new Map();
        var optionsCodes = {
            host: 'api.metrolisboa.pt',
            port: '8243',
            path: '/estadoServicoML/1.0.1/infoEstacao/todos',
            method: 'GET',
            headers : { 'Authorization' : `Bearer ${token}`,
            'accept': 'application/json'}
        }

        doRequest(optionsCodes).then((data) => {
            for (var el in data.resposta) {
                stationCodes.set(data.resposta[el].stop_name, data.resposta[el].stop_id);
            }
            resolve(stationCodes);
        });
    });
}


/**
 * Returns destination codes
 * @param {String} token for API request
 * @return {Promise} a promise of request
 * @return {Map} maps key destination name to its code
 */
function storeDestinationCodes(token) {
    return new Promise((resolve, reject) => {
    const destinationCodes = new Map();
        var optionsCodes = {
            host: 'api.metrolisboa.pt',
            port: '8243',
            path: '/estadoServicoML/1.0.1/infoDestinos/todos',
            method: 'GET',
            headers : { 'Authorization' : `Bearer ${token}`,
            'accept': 'application/json'}
        }

        doRequest(optionsCodes).then((data) => {
            for (var el in data.resposta) {
                destinationCodes.set(data.resposta[el].nome_destino, data.resposta[el].id_destino);
            }
            resolve(destinationCodes);
        });
    });
}

exports.app = functions.region('europe-west1').https.onRequest(app);