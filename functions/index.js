const functions = require("firebase-functions");
const express = require('express');
const https = require('https');
const cors = require('cors')
const config = require('./../config.js');
const { json } = require('express/lib/response');
const res = require('express/lib/response');
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//let token = ''; 
//const stationCodes = new Map();
//const destinationCodes = new Map();
app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({
    extended: true
}))


// Starts app
app.get('/', (request, response) => {
    var tokenOptions = {
        host: 'api.metrolisboa.pt',
        port: '8243',
        path: '/token',
        method: 'POST',
        headers : { 'Authorization' : `Basic ${config.BASE64_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    let token = '';
    doRequest(tokenOptions).then((data) => {token = data.access_token; console.log(token)});
    //TODO: handle async and error
    //storeStationCodes();
    //storeDestinationCodes();
});

//requestToken(); TODO: maybe better
//app.listen(process.env.PORT || 3000, () => console.log("Server available on http://localhost:3000"))
exports.app = functions.https.onRequest(app);

// Request for 
app.get('/metro', async (request, response) => {
    // TODO: use let stationCode = findStationCode("Oriente"); instead of storing all

    var optionsMetro = {
        host: 'api.metrolisboa.pt',
        port: '8243',
        path: `/estadoServicoML/1.0.1/tempoEspera/Estacao/${stationCodes.get(request.query.station)}`,
        method: 'GET',
        headers : { 'Authorization' : `Bearer ${token}`,
        'accept': 'application/json'}
    }

    let result = null;
    doRequest(optionsMetro).then((data) => {
        if(data.codigo == "200") {
            for(const el in data.resposta) {
                if(data.resposta[el].hasOwnProperty('destino')) {
                    if(data.resposta[el].destino == destinationCodes.get(request.query.destination))
                        console.log(data.resposta[el]);
                        result = data.resposta[el];
                }
            }

        } else {

        }       
        console.log("result" + result);
        response.send(result); 
    });

});



/**
 * Do a get request with options provided.
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
            console.log(responseBody);
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

function processError(err) {
    console.error("ERROR: " + err);
}

/**
 * Returns stations codes
 */
function storeStationCodes() {
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
    });
}


/**
 * Returns destination codes
 */
function storeDestinationCodes() {
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
    });

}